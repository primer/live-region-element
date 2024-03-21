export const Ordering = {
  Less: 'less',
  Equal: 'equal',
  Greater: 'greater',
} as const

export type Order = (typeof Ordering)[keyof typeof Ordering]
export type Compare<T> = (a: T, b: T) => Order
