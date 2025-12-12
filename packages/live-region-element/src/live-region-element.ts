import {MinHeap} from './MinHeap'
import {Ordering, type Order} from './order'
import {Deferred} from './Deferred'

type Politeness = 'polite' | 'assertive'

type AnnounceOptions =
  | {
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
      politeness?: 'assertive'

      /**
       * A delay in milliseconds to wait before announcing a message.
       */
      delayMs?: never
    }
  | {
      politeness?: 'polite'
      delayMs?: number
    }

type Message = {
  contents: string
  politeness: Politeness
  scheduled: number
  deferred: Deferred
}

/**
 * A type that can be cancelled. Canceling will stop the action from completing
 * if it has not already completed.
 */
type Cancelable<T> = T & {
  cancel: () => void
}

/**
 * The default delay between messages being announced by the live region
 */
const DEFAULT_THROTTLE_DELAY_MS = 150

class LiveRegionElement extends HTMLElement {
  /**
   * A flag to indicate if a message has been announced and we are currently
   * waiting for the delay to pass before announcing the next message.
   */
  #pending: boolean

  /**
   * A priority queue to store messages to be announced by the live region.
   */
  #queue: MinHeap<Message>

  /**
   * The id for a timeout being used by the live region to either wait until the
   * next message or wait until the delay has passed before announcing the next
   * message
   */
  #timeoutId: number | null

  constructor() {
    super()

    if (!this.shadowRoot) {
      const template = getTemplate()
      const shadowRoot = this.attachShadow({mode: 'open'})
      shadowRoot.appendChild(template.content.cloneNode(true))
    }

    this.#pending = false
    this.#timeoutId = null
    this.#queue = new MinHeap({
      compareFn: compareMessages,
    })
  }

  /**
   * The delay in milliseconds to wait between announcements. This helps to
   * prevent announcements getting dropped if multiple are made at the same time.
   */
  get delay(): number {
    const value = this.getAttribute('delay')
    if (value) {
      return parseInt(value, 10)
    }
    return DEFAULT_THROTTLE_DELAY_MS
  }

  set delay(value: number) {
    this.setAttribute('delay', `${value}`)
  }

  /**
   * Announce a message using a live region with a corresponding politeness
   * level.
   */
  public announce(message: string, options: AnnounceOptions = {}): Cancelable<Promise<void>> {
    const {delayMs, politeness = 'polite'} = options
    const now = Date.now()
    const deferred = new Deferred()
    const item: Message = {
      deferred,
      politeness,
      contents: message,
      scheduled: delayMs !== undefined ? now + delayMs : now,
    }
    this.#queue.insert(item)
    this.#performWork()

    return {
      ...deferred.getPromise(),
      cancel: () => {
        this.#queue.delete(item)
        deferred.resolve()
      },
    }
  }

  /**
   * Announce a message using the text content of an element with a
   * corresponding politeness level
   */
  public announceFromElement(element: HTMLElement, options?: AnnounceOptions): Cancelable<Promise<void>> {
    const textContent = getTextContent(element)
    if (textContent !== '') {
      return this.announce(textContent, options)
    }
    const promise = Promise.resolve()
    return {
      ...promise,
      cancel: noop,
    }
  }

  #performWork() {
    if (this.#pending) {
      return
    }

    let message = this.#queue.peek()
    if (!message) {
      return
    }

    if (this.#timeoutId !== null) {
      clearTimeout(this.#timeoutId)
      this.#timeoutId = null
    }

    const now = Date.now()
    if (message.scheduled <= now) {
      message = this.#queue.pop()
      if (message) {
        this.#updateContainerWithMessage(message)
      }
      this.#performWork()
      return
    }

    const timeout = message.scheduled - now
    this.#timeoutId = window.setTimeout(() => {
      this.#timeoutId = null
      this.#performWork()
    }, timeout)
  }

  public getMessage(politeness: AnnounceOptions['politeness'] = 'polite') {
    const container = this.shadowRoot?.getElementById(politeness)
    if (!container) {
      throw new Error('Unable to find container for message')
    }
    return container.textContent
  }

  #updateContainerWithMessage(message: Message) {
    // Prevent any other announcements from being made while we are updating the
    // contents to trigger an announcement
    this.#pending = true

    const {contents, deferred, politeness} = message
    const container = this.shadowRoot?.getElementById(politeness)
    if (!container) {
      this.#pending = false
      throw new Error(`Unable to find container for message. Expected a container with id="${politeness}"`)
    }

    if (container.textContent === contents) {
      container.textContent = `${contents}\u00A0`
    } else {
      container.textContent = contents
    }

    if (this.#timeoutId !== null) {
      clearTimeout(this.#timeoutId)
    }

    deferred.resolve()

    // Wait the set delay amount before announcing the next message. This should
    // help to make sure that announcements are only made once every delay
    // amount.
    if (this.delay > 0) {
      this.#timeoutId = window.setTimeout(() => {
        this.#timeoutId = null
        this.#pending = false
        this.#performWork()
      }, this.delay)
    } else {
      this.#timeoutId = null
      this.#pending = false
      this.#performWork()
    }
  }

  /**
   * Prevent pending messages from being announced by the live region.
   */
  public clear(): void {
    if (this.#timeoutId !== null) {
      clearTimeout(this.#timeoutId)
      this.#timeoutId = null
    }
    this.#pending = false
    this.#queue.clear()
  }
}

function getTextContent(element: HTMLElement): string {
  let value: string | null = ''

  if (element.hasAttribute('aria-label')) {
    value = element.getAttribute('aria-label')
     
  } else if (element.innerText) {
     
    value = element.innerText
  } else if (element.textContent) {
    value = element.textContent
  }

  return value ? value.trim() : ''
}

let template: HTMLTemplateElement | null = null

// The visually hidden styles here are based on the snippets from the following:
// - https://www.scottohara.me/blog/2023/03/21/visually-hidden-hack.html
// - https://benmyers.dev/blog/native-visually-hidden/
// - https://adrianroselli.com/2020/01/my-priority-of-methods-for-labeling-a-control.html
const templateContent = `
<style>
:host {
  border: 0;
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
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
   
  template.innerHTML = templateContent
  return template
}

export function compareMessages(a: Message, b: Message): Order {
  if (a.politeness === b.politeness) {
    if (a.scheduled === b.scheduled) {
      return Ordering.Equal
    }

    // Schedule a before b
    if (a.scheduled < b.scheduled) {
      return Ordering.Less
    }

    // Schedule a after b
    return Ordering.Greater
  }

  // Assertive messages have no delay and should always have priority over
  // non-assertive messages
  if (a.politeness === 'assertive' && b.politeness !== 'assertive') {
    return Ordering.Less
  }

  if (a.politeness !== 'assertive' && b.politeness === 'assertive') {
    return Ordering.Greater
  }

  return Ordering.Equal
}

function noop() {}

export {LiveRegionElement, templateContent}
export type {AnnounceOptions, Cancelable}
