/* eslint-disable @typescript-eslint/no-explicit-any */

export class Deferred<T = void> implements Promise<T> {
  [Symbol.toStringTag] = 'Deferred'

  #promise: Promise<T>
  #resolve!: (value: T | PromiseLike<T>) => void
  #reject!: (reason?: any) => void

  constructor() {
    this.#promise = new Promise<T>((resolve, reject) => {
      this.#resolve = resolve
      this.#reject = reject
    })
  }

  then<TResult1 = T, TResult2 = never>(
    onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | null | undefined,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null | undefined,
  ): Promise<TResult1 | TResult2> {
    return Promise.prototype.then.apply(this.#promise, [onfulfilled, onrejected]) as Promise<TResult1 | TResult2>
  }

  catch<TResult = never>(
    onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | null | undefined,
  ): Promise<T | TResult> {
    return Promise.prototype.catch.apply(this.#promise, [onrejected])
  }

  finally(onfinally?: (() => void) | null | undefined): Promise<T> {
    return Promise.prototype.finally.apply(this.#promise, [onfinally])
  }

  resolve(value: T) {
    this.#resolve(value)
  }

  reject(reason?: any) {
    this.#reject(reason)
  }

  getPromise(): Promise<T> {
    return this.#promise
  }
}
