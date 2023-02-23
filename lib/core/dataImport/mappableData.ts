export type MappableDataNames =
  | "activityCategory"
  | "activityModel"
  | "site"
  | "product"
  | "owner"
  | "writer"
  | "tags";

export type NumberDataNames = "input1" | "input2";
export type StringDataNames =
  | "commentary"
  | "source"
  | "inputInstruction"
  | "input1Unit"
  | "input2Unit";

export type MappableData<T = number> = {
  triedInput: string | null;
  value: T | null | undefined;
  entityName: string;
};

export function isMappingFailed<T>(mappableData: MappableData<T>): boolean {
  return mappableData.value === undefined && mappableData.triedInput != null;
}

export function isMappingPartiallyFailed(
  mappableData: MappableData<number[]>
): boolean {
  return (
    !isMappingFailed(mappableData) &&
    (mappableData.value?.some(data => data == null) ?? false)
  );
}

export const mappableDataNames: Record<MappableDataNames, true> = {
  activityCategory: true,
  activityModel: true,
  site: true,
  product: true,
  owner: true,
  writer: true,
  tags: true,
};

export function isMappableData(
  entryDataKey: string
): entryDataKey is MappableDataNames {
  return (mappableDataNames as Record<string, true>)[entryDataKey];
}
