export function increment() {
  return { type: 'counter/increment' } as const
}
export function decrement() {
  return { type: 'counter/decrement' } as const
}
