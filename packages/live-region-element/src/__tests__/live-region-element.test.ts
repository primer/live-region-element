import {afterEach, beforeEach, describe, test, expect} from 'vitest'
import {LiveRegionElement, compareMessages} from '../live-region-element'
import {Ordering} from '../order'
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

  describe('compareMessages', () => {
    test('messages with same politeness, a scheduled at same time as b', () => {
      const now = Date.now()
      expect(
        compareMessages(
          {
            contents: 'test',
            politeness: 'polite',
            scheduled: now,
          },
          {
            contents: 'test',
            politeness: 'polite',
            scheduled: now,
          },
        ),
      ).toBe(Ordering.Equal)
    })

    test('messages with same politeness, a scheduled before b', () => {
      const now = Date.now()
      expect(
        compareMessages(
          {
            contents: 'test',
            politeness: 'polite',
            scheduled: now,
          },
          {
            contents: 'test',
            politeness: 'polite',
            scheduled: now + 1000,
          },
        ),
      ).toBe(Ordering.Less)
    })

    test('messages with same politeness, a scheduled after b', () => {
      const now = Date.now()
      expect(
        compareMessages(
          {
            contents: 'test',
            politeness: 'polite',
            scheduled: now + 1000,
          },
          {
            contents: 'test',
            politeness: 'polite',
            scheduled: now,
          },
        ),
      ).toBe(Ordering.Greater)
    })

    test('messages with different politeness', () => {
      const now = Date.now()
      expect(
        compareMessages(
          {
            contents: 'test',
            politeness: 'assertive',
            scheduled: now,
          },
          {
            contents: 'test',
            politeness: 'polite',
            scheduled: now,
          },
        ),
      ).toBe(Ordering.Less)
    })
  })
})
