import {LiveRegionElement} from './live-region-element'

export function findOrCreateLiveRegion(from?: HTMLElement, appendTo?: HTMLElement): LiveRegionElement {
  let liveRegion: LiveRegionElement | null = null

  // If `from` is defined, try to find the closest `<live-region>` element
  // relative to the given element
  liveRegion = from ? getClosestLiveRegion(from) : null
  if (liveRegion !== null) {
    return liveRegion
  }

  // Get the containing element for the live region. If we know we are within a
  // dialog element, then live regions must live within that element.
  let container = document.body
  if (from) {
    const dialog = from.closest('dialog')
    if (dialog) {
      container = dialog
    }
  }

  // Otherwise, try to find any `<live-region>` element in the document
  liveRegion = container.querySelector('live-region')
  if (liveRegion !== null) {
    return liveRegion
  }

  // Finally, if none exist, create a new `<live-region>` element and append it
  // to the given `appendTo` element, if one exists
  liveRegion = document.createElement('live-region')
  if (appendTo) {
    appendTo.appendChild(liveRegion)
  } else {
    container.appendChild(liveRegion)
  }

  return liveRegion
}

export function getClosestLiveRegion(from: HTMLElement): LiveRegionElement | null {
  const dialog = from.closest('dialog')
  let current: HTMLElement | null = from

  while ((current = current.parentElement)) {
    // If the element exists within a <dialog>, we can only use a live region
    // within that element
    if (dialog && !dialog.contains(current)) {
      break
    }

    for (const child of current.childNodes) {
      if (child instanceof LiveRegionElement) {
        return child
      }
    }
  }

  return null
}
