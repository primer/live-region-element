import {afterEach, beforeEach, describe, test, expect, vi} from 'vitest'
import {LiveRegionElement, compareMessages} from '../live-region-element'
import {Ordering} from '../order'
import {Deferred} from '../Deferred'
import '../define'

describe('live-region-element', () => {
  let liveRegion: LiveRegionElement

  beforeEach(() => {
    vi.useFakeTimers()
    liveRegion = document.createElement('live-region') as LiveRegionElement
    document.body.appendChild(liveRegion)
  })

  afterEach(() => {
    document.body.removeChild(liveRegion)
    vi.restoreAllMocks()
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

  test('announce() with delayMs', () => {
    liveRegion.announce('test', {
      delayMs: 1000,
    })
    expect(liveRegion.getMessage('polite')).toBe('')
    vi.runAllTimers()
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  test('cancel announce() with delayMs', () => {
    const {cancel} = liveRegion.announce('test', {
      delayMs: 1000,
    })
    expect(liveRegion.getMessage('polite')).toBe('')

    cancel()
    vi.runAllTimers()

    expect(liveRegion.getMessage('polite')).toBe('')
  })

  test('await announce()', async () => {
    const announcement = liveRegion.announce('test', {
      delayMs: 1000,
    })
    expect(liveRegion.getMessage('polite')).toBe('')

    vi.runAllTimers()
    await announcement
    expect(liveRegion.getMessage('polite')).toBe('test')
  })

  test('cancel await announce()', async () => {
    const announcement = liveRegion.announce('test', {
      delayMs: 1000,
    })
    expect(liveRegion.getMessage('polite')).toBe('')

    vi.advanceTimersByTime(500)
    announcement.cancel()
    vi.runAllTimers()
    await announcement
    expect(liveRegion.getMessage('polite')).toBe('')
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
            deferred: new Deferred(),
          },
          {
            contents: 'test',
            politeness: 'polite',
            scheduled: now,
            deferred: new Deferred(),
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
            deferred: new Deferred(),
          },
          {
            contents: 'test',
            politeness: 'polite',
            scheduled: now + 1000,
            deferred: new Deferred(),
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
            deferred: new Deferred(),
          },
          {
            contents: 'test',
            politeness: 'polite',
            scheduled: now,
            deferred: new Deferred(),
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
            deferred: new Deferred(),
          },
          {
            contents: 'test',
            politeness: 'polite',
            scheduled: now,
            deferred: new Deferred(),
          },
        ),
      ).toBe(Ordering.Less)
    })
  })
})
