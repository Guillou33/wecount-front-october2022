/**
 * Associate the values of an array to the values of another array, equally repartitioned.  
 * For example : arrayProjection([0, 1, 2], [0, 1, 2, 3, 4]) returns
 * {
 *    0: 0,
 *    1: 2,
 *    2: 4,
 * }
 * @param array
 * @param projectToArray
 * @returns An object indexed by the value of {array}, with the associated value from {projectToArray}
 */
export function arrayProjection<T extends string | number, U>(
  array: T[],
  projectToArray: U[]
): Record<T, U> {
  if (array.length === 1) {
    const firstValue = array[0];
    const middleOfProjectToArray =
      projectToArray[Math.floor(projectToArray.length / 2)];
    return {
      [firstValue]: middleOfProjectToArray,
    } as Record<T, U>;
  }

  const projection = {} as Record<T, U>;
  const offset = projectToArray.length / (array.length - 1);
  for (let i = 0; i < array.length - 1; i++) {
    projection[array[i]] = projectToArray[Math.floor(i * offset)];
  }
  const lastValue = array[array.length - 1];
  const lastvalueOfProjectTo = projectToArray[projectToArray.length - 1];
  projection[lastValue] = lastvalueOfProjectTo;

  return projection;
}
