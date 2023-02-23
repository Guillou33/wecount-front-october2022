type SamplerOptions = {
  minimum: number;
  maximum: number;
  size: number;
};

export function sampler({ minimum, maximum, size }: SamplerOptions) {
  const range = maximum - minimum;
  const step = range / size;
  return (x: number) => {
    if (x >= maximum) {
      return size - 1;
    }
    if (x < minimum) {
      return 0;
    }
    return Math.floor((x - minimum) / step);
  };
}
