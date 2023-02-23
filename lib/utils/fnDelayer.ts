import { Function } from "@custom-types/utils";

/**
 *
 * @param delay in milliseconds
 * @returns a HOF that takes a function as parameter
 * and returns that function wich will be delayed by {delay} milliseconds when called
 */
function fnDelayer(delay: number) {
  return <T extends Function>(fn: T) =>
    (...args: Parameters<T>) =>
      setTimeout(fn, delay, ...args);
}

export default fnDelayer;
