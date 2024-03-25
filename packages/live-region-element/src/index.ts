import './define'
import {LiveRegionElement, templateContent, type AnnounceOptions} from './live-region-element'
import {findOrCreateLiveRegion} from './query'

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

export {LiveRegionElement, templateContent}
