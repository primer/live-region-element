import {afterEach, beforeEach, describe, test, expect} from 'vitest'
import {LiveRegionElement} from '../live-region-element'
import '../define'

describe('live-region-element', () => {
  let liveRegion: LiveRegionElement

  beforeEach(() => {
    liveRegion = document.createElement('live-region') as LiveRegionElement
    document.body.appendChild(liveRegion)
  })

  afterEach(() => {
    document.body.removeChild(liveRegion)
  })

  test('announce() message', () => {
    liveRegion.announce('test')
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  test('announce() uses `polite` as default politeness', () => {
    liveRegion.announce('test')
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  test('announce() with `assertive` politeness', () => {
    liveRegion.announce('test', {
      politeness: 'assertive',
    })
    expect(liveRegion.getMessage('polite')).toBe('')
    expect(liveRegion.getMessage('assertive')).toBe('test')
  })

  test('announceFromElement()', () => {
    const element = document.createElement('div')
    element.textContent = 'test'
    liveRegion.announceFromElement(element)
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  test('announceFromElement() with `assertive` politeness', () => {
    const element = document.createElement('div')
    element.textContent = 'test'
    liveRegion.announceFromElement(element, {
      politeness: 'assertive',
    })
    expect(liveRegion.getMessage('polite')).toBe('')
    expect(liveRegion.getMessage('assertive')).toBe('test')
  })
})
