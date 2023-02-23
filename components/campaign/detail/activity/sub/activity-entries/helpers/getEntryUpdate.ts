import { EntryData, WritableEntryData } from "@reducers/entries/campaignEntriesReducer";
import { EntryUpdate } from "../EntryCard";

export function getEntryUpdater(entry: EntryData) {
  return (data: EntryUpdate): WritableEntryData => {
    return {
      manualTco2:
        data.manualTco2 !== undefined ? data.manualTco2 : entry.manualTco2,
      manualUnitNumber:
        data.manualUnitNumber !== undefined
          ? data.manualUnitNumber
          : entry.manualUnitNumber,
      value: typeof data.value === "undefined" ? entry.value : data.value,
      value2: typeof data.value2 === "undefined" ? entry.value2 : data.value2,
      uncertainty:
        typeof data.uncertainty === "undefined"
          ? entry.uncertainty
          : data.uncertainty,
      description:
        typeof data.description === "undefined"
          ? entry.description
          : data.description,
      isExcludedFromTrajectory:
        typeof data.isExcludedFromTrajectory === "undefined" ?
          entry.isExcludedFromTrajectory :
          data.isExcludedFromTrajectory,
      title: typeof data.title === "undefined" ? entry.title : data.title,
      dataSource:
        typeof data.dataSource === "undefined"
          ? entry.dataSource
          : data.dataSource,
      productId:
        typeof data.productId === "undefined"
          ? entry.productId
          : data.productId,
      siteId: typeof data.siteId === "undefined" ? entry.siteId : data.siteId,
      emissionFactorId:
        typeof data.emissionFactorId === "undefined"
          ? entry.emissionFactorId
          : data.emissionFactorId,
      customEmissionFactorId:
        typeof data.customEmissionFactorId === "undefined"
          ? entry.customEmissionFactorId
          : data.customEmissionFactorId,
      status: typeof data.status === "undefined" ? entry.status : data.status,
      computeMethodType:
        data.computeMethodType !== undefined
          ? data.computeMethodType
          : entry.computeMethodType,
      computeMethodId:
        data.computeMethodId !== undefined
          ? data.computeMethodId
          : entry.computeMethodId,
      instruction:
        data.instruction !== undefined ? data.instruction : entry.instruction,
      ownerId: data.ownerId !== undefined ? data.ownerId : entry.ownerId,
      writerId: data.writerId !== undefined ? data.writerId : entry.writerId,
      entryTagIds: data.entryTagIds !== undefined ? data.entryTagIds : entry.entryTagIds,
    };
  };
}
