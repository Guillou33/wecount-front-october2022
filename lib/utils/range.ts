export function range(start: number, length: number): number[]{
  if(length <= 0){
    throw new TypeError("Invalid argument : 'length' must be greater than zero");
  }
  const numbers = [];
  for(let i=0; i<length; i++){
    numbers.push(start + i);
  }
  return numbers;
}