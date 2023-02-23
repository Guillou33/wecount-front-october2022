function mapObject<T extends object, U>(
  obj: T,
  fn: (value: T[keyof T], index: number, obj: T, key: keyof T) => U
): Record<keyof T, U> {
  return Object.entries(obj).reduce((acc, [key, value], index: number) => {
    acc[key as keyof T] = fn(value, index, obj, key as keyof T);
    return acc;
  }, {} as Record<keyof T, U>);
}

export default mapObject;
