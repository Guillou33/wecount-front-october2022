import memoize from "lodash/memoize";

function identityFunction<T>(value: T): T {
  return value;
}

const memoValue = memoize(identityFunction, JSON.stringify);

export default memoValue;
