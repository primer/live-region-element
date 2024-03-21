export interface Throttle<T extends (...args: any) => void> {
  (...args: Parameters<T>): void
  cancel(): void
}

export function throttle<T extends (...args: any) => void>(fn: T, wait: number): Throttle<T> {
  const queue: Array<Array<Parameters<T>>> = []
  let timeoutId: number | null = null

  function processQueue() {
    if (timeoutId !== null) {
      return
    }

    if (queue.length === 0) {
      return
    }

    const args = queue.shift()
    if (args === undefined) {
      return
    }

    fn(...args)

    timeoutId = window.setTimeout(() => {
      timeoutId = null
      processQueue()
    }, wait)
  }

  function throttled(...args: Parameters<T>) {
    queue.push(args)
    if (timeoutId === null) {
      processQueue()
    }
  }

  throttled.cancel = () => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
    queue.length = 0
  }

  return throttled
}
