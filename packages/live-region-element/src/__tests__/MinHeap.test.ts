import {describe, test, beforeEach, expect} from 'vitest'
import {MinHeap} from '../MinHeap'
import {Ordering} from '../order'

describe('MinHeap', () => {
  let heap: MinHeap<number>

  beforeEach(() => {
    heap = new MinHeap({compareFn: compare})
  })

  test('ordering', () => {
    heap.insert(3)
    heap.insert(1)
    heap.insert(2)
    expect(heap.pop()).toBe(1)
    expect(heap.pop()).toBe(2)
    expect(heap.pop()).toBe(3)
  })

  test('peek()', () => {
    heap.insert(3)
    expect(heap.peek()).toBe(3)

    heap.insert(1)
    expect(heap.peek()).toBe(1)

    heap.insert(2)
    expect(heap.peek()).toBe(1)

    heap.pop()
    expect(heap.peek()).toBe(2)
  })

  test('peek() with empty heap', () => {
    expect(heap.peek()).not.toBeDefined()
  })

  test('delete()', () => {
    heap.insert(3)
    heap.insert(1)
    heap.insert(2)
    expect(heap.peek()).toBe(1)

    heap.delete(1)
    expect(heap.peek()).toBe(2)
  })

  test('delete() with non-existent value', () => {
    heap.insert(3)
    heap.insert(1)
    heap.insert(2)

    expect(heap.peek()).toBe(1)
    heap.delete(0)
    expect(heap.peek()).toBe(1)
  })

  test('size', () => {
    expect(heap.size).toBe(0)

    heap.insert(3)
    expect(heap.size).toBe(1)

    heap.insert(1)
    heap.insert(2)
    expect(heap.size).toBe(3)

    heap.peek()
    expect(heap.size).toBe(3)

    heap.pop()
    expect(heap.size).toBe(2)
  })
})

function compare(a: number, b: number) {
  if (a < b) {
    return Ordering.Less
  }
  if (a > b) {
    return Ordering.Greater
  }
  return Ordering.Equal
}
