export default class Memoize<MemoizedFn extends (...args: any[]) => any> {
  private memoized: MemoizedFn;
  private lastResult: any;
  private lastArgs: any[] = [];

  constructor(memoized: MemoizedFn) {
    this.memoized = memoized;
  }

  execute(...args: Parameters<MemoizedFn>): ReturnType<MemoizedFn> {
    if (!this.memoized) {
      throw new Error("Undefined memoize function");
    }
    if (!this.lastArgs || !this.lastResult) {
      this.executeAndSave(...args);
      return this.lastResult;
    }

    let argsAreSame = true;
    args.forEach((arg, index) => {
      if (arg !== this.lastArgs[index]) {
        argsAreSame = false;
      }
    });

    if (argsAreSame) {
      return this.lastResult;
    }

    this.executeAndSave(...args);
    return this.lastResult;
  }

  private executeAndSave(...args: any[]): void {
    this.lastArgs = args;
    this.lastResult = this.memoized(...args);
  }
}
