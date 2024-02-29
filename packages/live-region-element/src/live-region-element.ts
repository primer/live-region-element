type AnnounceOptions = {
  politeness?: 'polite' | 'assertive'
}

class LiveRegionElement extends HTMLElement {
  constructor() {
    super()
    if (!this.shadowRoot) {
      const template = getTemplate()
      const shadowRoot = this.attachShadow({mode: 'open'})
      shadowRoot.appendChild(template.content.cloneNode(true))
    }
  }

  /**
   * Announce a message using a live region with a corresponding politeness
   * level.
   *
   * Note: a politeness level of `assertive` should only be used for
   * time-sensistive or critical notifications that absolutely require the
   * user's immediate attention
   *
   * @see https://www.w3.org/TR/wai-aria/#aria-live
   * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions
   */
  public announce(message: string, options: AnnounceOptions = {}) {
    const {politeness = 'polite'} = options
    const container = this.shadowRoot?.getElementById(politeness)
    if (!container) {
      throw new Error('Unable to find container for message')
    }

    if (container.textContent === message) {
      container.textContent = `${message}\u00A0`
    } else {
      container.textContent = message
    }
  }

  /**
   * Announce a message using the text content of an element with a
   * corresponding politeness level
   */
  public announceFromElement(element: HTMLElement, options?: AnnounceOptions) {
    const textContent = getTextContent(element)
    if (textContent !== '') {
      this.announce(textContent, options)
    }
  }

  getMessage(politeness: AnnounceOptions['politeness'] = 'polite') {
    const container = this.shadowRoot?.getElementById(politeness)
    if (!container) {
      throw new Error('Unable to find container for message')
    }
    return container.textContent
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

export {LiveRegionElement, templateContent}
export type {AnnounceOptions}
