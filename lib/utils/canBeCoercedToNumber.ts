export function canBeCoercedToNumber(value: string): boolean {
  return !isNaN(Number(value));
}
