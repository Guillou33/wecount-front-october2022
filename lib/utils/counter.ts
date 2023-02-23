export default function* counter(from: number = 0): Generator<number, never> {
  while (true) {
    yield from++;
  }
}
