const getHashNumber = (seed: string) : number => {
  let hash = 0;
  for(let i = 0; i < seed.length; i++) {
    hash = Math.imul(31, hash) + seed.charCodeAt(i) | 0;
  }

  return Math.abs(hash);
};

export { getHashNumber }
