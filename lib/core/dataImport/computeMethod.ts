import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";

type NonStandardType =
  | ComputeMethodType.DEPRECATED_EMISSION_FACTOR
  | ComputeMethodType.RAW_DATA;

export type StandardComputeMethod = {
  type: ComputeMethodType.STANDARD;
  id: number;
  name: string;
};

type NonStandardComputeMethod = {
  type: NonStandardType;
};

export type ComputeMethod = StandardComputeMethod | NonStandardComputeMethod;

export function isNonStandard(
  computeMethod: ComputeMethod
): computeMethod is NonStandardComputeMethod {
  return isNonStandardType(computeMethod.type);
}

export function isStandard(
  computeMethod: ComputeMethod
): computeMethod is StandardComputeMethod {
  return !isNonStandard(computeMethod);
}

export function isNonStandardType(type: string): type is NonStandardType {
  return (
    type === ComputeMethodType.DEPRECATED_EMISSION_FACTOR ||
    type === ComputeMethodType.RAW_DATA
  );
}

export function areComputeMethodEqual(
  a: ComputeMethod | null,
  b: ComputeMethod | null
): boolean {
  if (a === null && b === null) {
    return true;
  }
  if (a === null || b === null) {
    return false;
  }
  if (
    (isStandard(a) && isNonStandard(b)) ||
    (isNonStandard(a) && isStandard(b))
  ) {
    return false;
  }
  if (isStandard(a) && isStandard(b)) {
    return a.id === b.id;
  }
  return a.type === b.type;
}

export function getComputeMethodValue(
  computeMethod: ComputeMethod | null
): string | null {
  if (computeMethod == null) {
    return null;
  }
  if (isNonStandard(computeMethod)) {
    return computeMethod.type;
  }
  return computeMethod.id.toString();
}
