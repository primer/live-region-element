import {LiveRegionElement, type AnnounceOptions, type Cancelable} from './live-region-element'

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
export function announce(message: string, options: GlobalAnnounceOptions = {}): Cancelable<Promise<void>> {
  let liveRegion = findLiveRegion(options.from)
  if (!liveRegion) {
    liveRegion = document.createElement('live-region') as LiveRegionElement
    if (options.appendTo) {
      options.appendTo.appendChild(liveRegion)
    } else {
      const container = getLiveRegionContainer(options.from)
      container.appendChild(liveRegion)
    }

    if (process.env.NODE_ENV === 'test') {
      return liveRegion.announce(message, options)
    }

    let canceled = false
    let cancel = () => {
      canceled = true
    }
     
    const promise = wait(REGISTER_WAIT_MS).then(() => {
      if (!canceled) {
        const result = liveRegion!.announce(message, options)
        cancel = result.cancel
        return result
      }
    })

    return {
      ...promise,
      cancel: () => {
        cancel()
      },
    }
  }

  return liveRegion.announce(message, options)
}

/**
 * Announce a message using the text content of an element using a live region
 * with a corresponding politeness level
 */
export function announceFromElement(
  element: HTMLElement,
  options: GlobalAnnounceOptions = {},
): Cancelable<Promise<void>> {
  let liveRegion = findLiveRegion(options.from)
  if (!liveRegion) {
    liveRegion = document.createElement('live-region')
    if (options.appendTo) {
      options.appendTo.appendChild(liveRegion)
    } else {
      const container = getLiveRegionContainer(options.from)
      container.appendChild(liveRegion)
    }

    if (process.env.NODE_ENV === 'test') {
      return liveRegion.announceFromElement(element, options)
    }

    let canceled = false
    let cancel = () => {
      canceled = true
    }
     
    const promise = wait(REGISTER_WAIT_MS).then(() => {
      if (!canceled) {
        const result = liveRegion!.announceFromElement(element, options)
        cancel = result.cancel
        return result
      }
    })

    return {
      ...promise,
      cancel: () => {
        cancel()
      },
    }
  }

  return liveRegion.announceFromElement(element, options)
}

function findLiveRegion(from?: HTMLElement): LiveRegionElement | null {
  let liveRegion: LiveRegionElement | null = null

  // If `from` is defined, try to find the closest `<live-region>` element
  // relative to the given element
  liveRegion = from ? getClosestLiveRegion(from) : null
  if (liveRegion !== null) {
    return liveRegion
  }

  // Otherwise, try to find any `<live-region>` element in the closest
  // container, either a <dialog> or the document body
  const container = getLiveRegionContainer(from)
  liveRegion = container.querySelector('live-region')
  if (liveRegion !== null) {
    return liveRegion
  }

  return null
}

function getClosestLiveRegion(from: HTMLElement): LiveRegionElement | null {
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

// Get the containing element for the live region. If we know we are within a
// dialog element, then live regions must live within that element.
function getLiveRegionContainer(from?: HTMLElement): HTMLElement {
  let container = document.body
  if (from) {
    const dialog = from.closest('dialog')
    if (dialog) {
      container = dialog
    }
  }
  return container
}

/**
 * The time to wait after creating a live region before announcing a message.
 * This time is to allow assistive technologies to register the live region
 * before we use it to announce a message.
 */
const REGISTER_WAIT_MS = 150

function wait(ms: number) {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}
