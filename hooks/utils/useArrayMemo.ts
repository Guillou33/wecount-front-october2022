import { useMemo } from "react";

type Primitive = string | number | boolean | undefined | null | Symbol;

/**
 * Will preserve the referencial equality of the given array if all its values are equals
 * @param array
 * @returns the memoized array
 */
function useArrayMemo<T extends Primitive>(array: T[]): T[] {
  return useMemo(() => array, array);
}

export default useArrayMemo;
