import {afterEach, describe, test, expect} from 'vitest'
import {announce, announceFromElement} from '../'
import {LiveRegionElement} from '../live-region-element'

describe('Global announcements', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  describe('announce()', () => {
    test('announces with an existing live region', () => {
      const liveRegion = document.createElement('live-region') as LiveRegionElement
      document.body.appendChild(liveRegion)

      announce('test')
      expect(liveRegion.getMessage('polite')).toBe('test')
    })

    test('announces without an existing live region', () => {
      announce('test')

      const liveRegion = document.querySelector('live-region') as LiveRegionElement
      expect(liveRegion.getMessage('polite')).toBe('test')
    })

    test('announce() uses `polite` as default politeness', () => {
      announce('test')
      const liveRegion = document.querySelector('live-region') as LiveRegionElement
      expect(liveRegion.getMessage('polite')).toBe('test')
    })

    test('announce() with `assertive` politeness', () => {
      announce('test', {
        politeness: 'assertive',
      })
      const liveRegion = document.querySelector('live-region') as LiveRegionElement
      expect(liveRegion.getMessage('polite')).toBe('')
      expect(liveRegion.getMessage('assertive')).toBe('test')
    })

    test('announce() finds closest <live-region> element with `from`', () => {
      document.body.innerHTML = `
        <dialog open>
          <div id="container"></div>
          <live-region id="dialog-live-region"></live-region>
        </dialog>
        <live-region id="global-live-region"></live-region>
      `

      const from = document.getElementById('container')!
      announce('test', {from})

      const dialogLiveRegion = document.getElementById('dialog-live-region') as LiveRegionElement
      expect(dialogLiveRegion.getMessage('polite')).toBe('test')

      const globalLiveRegion = document.getElementById('global-live-region') as LiveRegionElement
      expect(globalLiveRegion.getMessage('polite')).toBe('')
    })

    test('appendTo should contain a live-region if no live-region is available', () => {
      document.body.innerHTML = `
        <div id="container">
        </div>
      `
      const appendTo = document.getElementById('container')!
      announce('test', {appendTo})

      expect(appendTo.querySelector('live-region')).toBeInstanceOf(LiveRegionElement)

      const liveRegion = document.querySelector('live-region') as LiveRegionElement
      expect(liveRegion.getMessage('polite')).toBe('test')
    })

    test('appendTo should not contain a live-region if a live-region is available', () => {
      document.body.innerHTML = `
        <div id="container">
        </div>
        <live-region></live-region>
      `
      const appendTo = document.getElementById('container')!
      announce('test', {appendTo})

      expect(appendTo.querySelector('live-region')).toBe(null)

      const liveRegion = document.querySelector('live-region') as LiveRegionElement
      expect(liveRegion.getMessage('polite')).toBe('test')
    })
  })

  describe('announceFromElement()', () => {
    test('announceFromElement()', () => {
      const element = document.createElement('div')
      element.textContent = 'test'

      announceFromElement(element)

      const liveRegion = document.querySelector('live-region') as LiveRegionElement
      expect(liveRegion.getMessage('polite')).toBe('test')
    })

    test('announceFromElement() uses `polite` as default politeness', () => {
      const element = document.createElement('div')
      element.textContent = 'test'

      announceFromElement(element)

      const liveRegion = document.querySelector('live-region') as LiveRegionElement
      expect(liveRegion.getMessage('polite')).toBe('test')
    })

    test('announceFromElement() with `assertive` politeness', () => {
      const element = document.createElement('div')
      element.textContent = 'test'

      announceFromElement(element, {
        politeness: 'assertive',
      })

      const liveRegion = document.querySelector('live-region') as LiveRegionElement
      expect(liveRegion.getMessage('polite')).toBe('')
      expect(liveRegion.getMessage('assertive')).toBe('test')
    })
  })
})
