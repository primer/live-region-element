import {LiveRegionElement, templateContent, type AnnounceOptions} from './live-region-element'

type GlobalAnnounceOptions = AnnounceOptions & {
  /**
   * Provide an element into which the <live-region> element is appended
   */
  appendTo?: HTMLElement

  /**
   * Provide an element that is used as the starting point when finding the
   * closest <live-region> element
   */
  from?: HTMLElement
}

/**
 * Announce a message using a live region with a corresponding politeness
 * level
 */
export function announce(message: string, options: GlobalAnnounceOptions = {}) {
  const liveRegion = findOrCreateLiveRegion(options.from, options.appendTo)
  return liveRegion.announce(message, options)
}

/**
 * Announce a message using the text content of an element using a live region
 * with a corresponding politeness level
 */
export function announceFromElement(element: HTMLElement, options: GlobalAnnounceOptions = {}) {
  const liveRegion = findOrCreateLiveRegion(options.from, options.appendTo)
  return liveRegion.announceFromElement(element, options)
}

let liveRegion: LiveRegionElement | null = null

function findOrCreateLiveRegion(from?: HTMLElement, appendTo?: HTMLElement): LiveRegionElement {
  // Check to see if we have already created a `<live-region>` element and that
  // it is currently connected to the DOM.
  if (liveRegion !== null && liveRegion.isConnected) {
    return liveRegion
  }

  // If `from` is defined, try to find the closest `<live-region>` element
  // relative to the given element
  liveRegion = from ? getClosestLiveRegion(from) : null
  if (liveRegion !== null) {
    return liveRegion as LiveRegionElement
  }

  // Otherwise, try to find any `<live-region>` element in the document
  liveRegion = document.querySelector('live-region')
  if (liveRegion !== null) {
    return liveRegion as LiveRegionElement
  }

  // Finally, if none exist, create a new `<live-region>` element and append it
  // to the given `appendTo` element, if one exists
  liveRegion = document.createElement('live-region') as LiveRegionElement
  if (appendTo) {
    appendTo.appendChild(liveRegion)
  } else {
    document.body.appendChild(liveRegion)
  }

  return liveRegion
}

function getClosestLiveRegion(from: HTMLElement): LiveRegionElement | null {
  let current: HTMLElement | null = from

  while ((current = current.parentElement)) {
    for (const child of current.childNodes) {
      if (child instanceof LiveRegionElement) {
        return child
      }
    }
  }

  return null
}

export {LiveRegionElement, templateContent}
