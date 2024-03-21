import {Ordering, type Compare} from './order'

export class MinHeap<T> {
  #compareFn: Compare<T>
  #heap: Array<T>

  constructor({compareFn}: {compareFn: Compare<T>}) {
    this.#compareFn = compareFn
    this.#heap = []
  }

  insert(value: T) {
    this.#heap.push(value)
    this.#heapifyUp()
  }

  pop(): T | undefined {
    const item = this.#heap[0]

    if (this.#heap[this.#heap.length - 1]) {
      this.#heap[0] = this.#heap[this.#heap.length - 1]!
      this.#heap.pop()
    }
    this.#heapifyDown()

    return item
  }

  peek(): T | undefined {
    return this.#heap[0]
  }

  delete(value: T): void {
    const index = this.#heap.indexOf(value)
    if (index === -1) {
      return
    }

    swap(this.#heap, index, this.#heap.length - 1)
    this.#heap.pop()
    this.#heapifyDown()
  }

  clear(): void {
    this.#heap = []
  }

  get size(): number {
    return this.#heap.length
  }

  #heapifyDown() {
    let index = 0
    while (hasLeftChild(index, this.#heap.length)) {
      let smallerChildIndex = getLeftChildIndex(index)
      if (
        hasRightChild(index, this.#heap.length) &&
        this.#compareFn(rightChild(this.#heap, index)!, leftChild(this.#heap, index)!) === Ordering.Less
      ) {
        smallerChildIndex = getRightChildIndex(index)
      }
      if (this.#compareFn(this.#heap[index]!, this.#heap[smallerChildIndex]!) === Ordering.Less) {
        break
      } else {
        swap(this.#heap, index, smallerChildIndex)
      }
      index = smallerChildIndex
    }
  }

  #heapifyUp() {
    let index = this.#heap.length - 1
    while (hasParent(index) && this.#compareFn(this.#heap[index]!, parent(this.#heap, index)!) === Ordering.Less) {
      swap(this.#heap, index, getParentIndex(index))
      index = getParentIndex(index)
    }
  }
}

function getLeftChildIndex(index: number) {
  return 2 * index + 1
}

function getRightChildIndex(index: number) {
  return 2 * index + 2
}

function getParentIndex(index: number) {
  return Math.floor((index - 1) / 2)
}

function hasLeftChild(index: number, size: number) {
  return getLeftChildIndex(index) < size
}

function hasRightChild(index: number, size: number) {
  return getRightChildIndex(index) < size
}

function hasParent(index: number) {
  return index > 0
}

function leftChild<T>(heap: Array<T>, index: number) {
  return heap[getLeftChildIndex(index)]
}

function rightChild<T>(heap: Array<T>, index: number) {
  return heap[getRightChildIndex(index)]
}

function parent<T>(heap: Array<T>, index: number) {
  return heap[getParentIndex(index)]
}

function swap(heap: Array<unknown>, a: number, b: number) {
  const tmp = heap[a]
  heap[a] = heap[b]
  heap[b] = tmp
}
