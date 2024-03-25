import {describe, test, expect, afterEach} from 'vitest'
import '../define'
import {findOrCreateLiveRegion, getClosestLiveRegion} from '../query'

afterEach(() => {
  document.body.innerHTML = ''
})

describe('findOrCreateLiveRegion', () => {
  test('no live region', () => {
    expect(document.querySelector('live-region')).toBe(null)
    const liveRegion = findOrCreateLiveRegion()
    expect(liveRegion).toBeInTheDocument()
    expect(document.querySelector('live-region')).toBe(liveRegion)
  })

  test('existing live region', () => {
    const liveRegion = document.createElement('live-region')
    document.body.appendChild(liveRegion)
    expect(findOrCreateLiveRegion()).toBe(liveRegion)
  })

  test('in dialog with live region', () => {
    document.body.innerHTML = `
      <dialog>
        <div id="target"></div>
        <live-region id="local"></live-region>
      </dialog>
      <live-region id="global"></live-region>
    `
    const liveRegion = findOrCreateLiveRegion(document.getElementById('target')!)
    expect(liveRegion).toBe(document.getElementById('local'))
  })

  test('in dialog with no live region', () => {
    document.body.innerHTML = `
      <dialog>
        <div id="target"></div>
      </dialog>
      <live-region id="global"></live-region>
    `
    const dialog = document.querySelector('dialog')!
    expect(dialog.querySelector('live-region')).toBe(null)

    const liveRegion = findOrCreateLiveRegion(document.getElementById('target')!)
    expect(dialog).toContainElement(liveRegion)
  })
})

describe('getClosestLiveRegion', () => {
  test('no live region', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)
    expect(getClosestLiveRegion(element)).toBe(null)
  })

  test('live region in document.body', () => {
    const element = document.createElement('div')
    document.body.appendChild(element)

    const liveRegion = document.createElement('live-region')
    document.body.appendChild(liveRegion)

    expect(getClosestLiveRegion(element)).toBe(liveRegion)
  })

  test('live region as sibling', () => {
    document.body.innerHTML = `
      <div>
        <div id="target"></div>
        <live-region id="sibling"></live-region>
      </div>
      <live-region id="global"></live-region>
    `

    expect(getClosestLiveRegion(document.getElementById('target')!)).toBe(document.getElementById('sibling'))
  })

  test('live region within dialog', () => {
    document.body.innerHTML = `
      <dialog>
        <div id="target"></div>
        <live-region id="local"></live-region>
      </dialog>
      <live-region id="global"></live-region>
    `
    expect(getClosestLiveRegion(document.getElementById('target')!)).toBe(document.getElementById('local'))
  })

  test('no live region within dialog', () => {
    document.body.innerHTML = `
      <dialog>
        <div id="target"></div>
      </dialog>
      <live-region id="global"></live-region>
    `
    expect(getClosestLiveRegion(document.getElementById('target')!)).toBe(null)
  })
})
