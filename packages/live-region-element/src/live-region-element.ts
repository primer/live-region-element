import {MinHeap} from './MinHeap'
import {Ordering, type Order} from './order'
import {throttle, type Throttle} from './throttle'

type Politeness = 'polite' | 'assertive'

type AnnounceOptions = {
  /**
   * A delay in milliseconds to wait before announcing a message.
   */
  delayMs?: number

  /**
   * The politeness level for a message.
   *
   * Note: a politeness level of `assertive` should only be used for
   * time-sensistive or critical notifications that absolutely require the
   * user's immediate attention
   *
   * @see https://www.w3.org/TR/wai-aria/#aria-live
   * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
   */
  politeness?: Politeness
}

type Message = {
  contents: string
  politeness: Politeness
  scheduled: number | 'immediate'
}

/**
 * A function to cancel a scheduled message.
 */
type Cancel = () => void

/**
 * The default delay between messages being announced by the live region
 */
const DEFAULT_THROTTLE_DELAY_MS = 500

class LiveRegionElement extends HTMLElement {
  #queue: MinHeap<Message>
  #timeoutId: number | null
  updateContainerWithMessage: Throttle<(message: Message) => void>

  constructor({waitMs}: {waitMs?: number} = {}) {
    super()

    if (!this.shadowRoot) {
      const template = getTemplate()
      const shadowRoot = this.attachShadow({mode: 'open'})
      shadowRoot.appendChild(template.content.cloneNode(true))
    }

    this.#timeoutId = null
    this.#queue = new MinHeap({
      compareFn: compareMessages,
    })

    this.updateContainerWithMessage = throttle((message: Message) => {
      const {contents, politeness} = message
      const container = this.shadowRoot?.getElementById(politeness)
      if (!container) {
        throw new Error(`Unable to find container for message. Expected a container with id="${politeness}"`)
      }

      if (container.textContent === contents) {
        container.textContent = `${contents}\u00A0`
      } else {
        container.textContent = contents
      }
    }, waitMs ?? DEFAULT_THROTTLE_DELAY_MS)
  }

  /**
   * Announce a message using a live region with a corresponding politeness
   * level.
   */
  public announce(message: string, options: AnnounceOptions = {}): Cancel {
    const {delayMs, politeness = 'polite'} = options
    const item: Message = {
      politeness,
      contents: message,
      scheduled: delayMs !== undefined ? Date.now() + delayMs : 'immediate',
    }
    this.#queue.insert(item)
    this.performWork()
    return () => {
      this.#queue.delete(item)
    }
  }

  /**
   * Announce a message using the text content of an element with a
   * corresponding politeness level
   */
  public announceFromElement(element: HTMLElement, options?: AnnounceOptions): Cancel {
    const textContent = getTextContent(element)
    if (textContent !== '') {
      return this.announce(textContent, options)
    }
    return noop
  }

  performWork() {
    let message = this.#queue.peek()
    if (!message) {
      return
    }

    if (this.#timeoutId !== null) {
      clearTimeout(this.#timeoutId)
      this.#timeoutId = null
    }

    if (message.scheduled === 'immediate') {
      message = this.#queue.pop()
      if (message) {
        this.updateContainerWithMessage(message)
      }
      this.performWork()
      return
    }

    const now = Date.now()
    if (message.scheduled <= now) {
      message = this.#queue.pop()
      if (message) {
        this.updateContainerWithMessage(message)
      }
      this.performWork()
      return
    }

    const timeout = message.scheduled > now ? message.scheduled - now : 0
    this.#timeoutId = window.setTimeout(() => {
      this.#timeoutId = null
      this.performWork()
    }, timeout)
  }

  getMessage(politeness: AnnounceOptions['politeness'] = 'polite') {
    const container = this.shadowRoot?.getElementById(politeness)
    if (!container) {
      throw new Error('Unable to find container for message')
    }
    return container.textContent
  }

  /**
   * Stop any pending messages from being announced by the live region
   */
  public clear(): void {
    if (this.#timeoutId !== null) {
      clearTimeout(this.#timeoutId)
      this.#timeoutId = null
    }

    this.updateContainerWithMessage.cancel()
    this.#queue.clear()
  }
}

function getTextContent(element: HTMLElement): string {
  let value: string | null = ''

  if (element.hasAttribute('aria-label')) {
    value = element.getAttribute('aria-label')
    // eslint-disable-next-line github/no-innerText
  } else if (element.innerText) {
    // eslint-disable-next-line github/no-innerText
    value = element.innerText
  } else if (element.textContent) {
    value = element.textContent
  }

  return value ? value.trim() : ''
}

let template: HTMLTemplateElement | null = null

const templateContent = `
<style>
:host {
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  white-space: nowrap;
  width: 1px;
}
</style>
<div id="polite" aria-live="polite" aria-atomic="true"></div>
<div id="assertive" aria-live="assertive" aria-atomic="true"></div>
`

function getTemplate() {
  if (template) {
    return template
  }
  template = document.createElement('template')
  // eslint-disable-next-line github/no-inner-html
  template.innerHTML = templateContent
  return template
}

function compareMessages(a: Message, b: Message): Order {
  if (a.scheduled === b.scheduled) {
    return Ordering.Equal
  }

  // Schedule a before b
  if (a.scheduled === 'immediate' && b.scheduled !== 'immediate') {
    return Ordering.Less
  }

  // Schedule a after b
  if (a.scheduled !== 'immediate' && b.scheduled === 'immediate') {
    return Ordering.Greater
  }

  // Schedule a before b
  if (a.scheduled < b.scheduled) {
    return Ordering.Less
  }

  // Schedule a after b
  return Ordering.Greater
}

function noop() {}

export {LiveRegionElement, templateContent}
export type {AnnounceOptions}
