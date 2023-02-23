function getEvolution(value1: number, value2: number): number {
  if (value1 === 0 && value2 === 0) {
    return 0;
  }
  if (value1 === 0) {
    return Infinity;
  }
  return (value2 - value1) / value1;
}

export default getEvolution;
