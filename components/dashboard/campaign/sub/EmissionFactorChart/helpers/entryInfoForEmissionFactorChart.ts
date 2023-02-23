import { ActivityEntryExtended as Entry } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";

type BaseEntryInfo = {
  entries: Entry[];
  tCo2: number;
  maximumEntryTco2: number;
  minimumEntryTco2: number;
};

type EmissionFactorEntryInfo = BaseEntryInfo & {
  type: "emissionFactor";
  emissionFactorName: string;
};

export type ManualEntryInfo = BaseEntryInfo & {
  type: "manualEntries";
  activityModelId: number;
};

export type EntryInfoForEmissionFactorChart =
  | EmissionFactorEntryInfo
  | ManualEntryInfo;

function getSumOfEntryInfoBase(
  entryInfoA: EntryInfoForEmissionFactorChart,
  entryInfoB: EntryInfoForEmissionFactorChart
): BaseEntryInfo {
  return {
    entries: [...entryInfoA.entries, ...entryInfoB.entries],
    tCo2: entryInfoA.tCo2 + entryInfoB.tCo2,
    maximumEntryTco2:
      entryInfoA.maximumEntryTco2 > entryInfoB.maximumEntryTco2
        ? entryInfoA.maximumEntryTco2
        : entryInfoB.maximumEntryTco2,
    minimumEntryTco2:
      entryInfoA.minimumEntryTco2 < entryInfoB.minimumEntryTco2
        ? entryInfoA.minimumEntryTco2
        : entryInfoB.minimumEntryTco2,
  };
}

function getSumOfEmissionFactorEntryInfo(
  entryInfoA: EmissionFactorEntryInfo,
  entryInfoB: EmissionFactorEntryInfo
): EmissionFactorEntryInfo {
  if (entryInfoA.emissionFactorName !== entryInfoB.emissionFactorName) {
    throw new Error(
      "Trying to sum two entries comming from two different emission factor"
    );
  }
  return {
    ...getSumOfEntryInfoBase(entryInfoA, entryInfoB),
    type: "emissionFactor",
    emissionFactorName: entryInfoA.emissionFactorName,
  };
}

function getSumOfEntryInfoForEmissionFactorChart(
  entryInfoA: EntryInfoForEmissionFactorChart,
  entryInfoB: EntryInfoForEmissionFactorChart
): EntryInfoForEmissionFactorChart {
  if (isManualEntryInfo(entryInfoA) && isManualEntryInfo(entryInfoB)) {
    return getSumOfManualEntryInfo(entryInfoA, entryInfoB);
  }
  if (
    isEmissionFactorEntryInfo(entryInfoA) &&
    isEmissionFactorEntryInfo(entryInfoB)
  ) {
    return getSumOfEmissionFactorEntryInfo(entryInfoA, entryInfoB);
  }
  throw new Error("Impossible to sum entry info with different types");
}

function getSumOfManualEntryInfo(
  entryInfoA: ManualEntryInfo,
  entryInfoB: ManualEntryInfo
): ManualEntryInfo {
  if (entryInfoA.activityModelId !== entryInfoB.activityModelId) {
    throw new Error(
      "Trying to sum two manual entries comming from two different activity models"
    );
  }
  return {
    ...getSumOfEntryInfoBase(entryInfoA, entryInfoB),
    type: "manualEntries",
    activityModelId: entryInfoA.activityModelId,
  };
}

function getBaseEntryInfoFromEntry(entry: Entry): BaseEntryInfo {
  return {
    entries: [entry],
    tCo2: entry.resultTco2 ?? 0,
    maximumEntryTco2: entry.resultTco2 ?? 0,
    minimumEntryTco2: entry.resultTco2 ?? 0,
  };
}

function getEmissionFactorEntryInfoFromEntry(
  entry: Entry
): EmissionFactorEntryInfo {
  return {
    ...getBaseEntryInfoFromEntry(entry),
    type: "emissionFactor",
    emissionFactorName: entry.emissionFactor?.name ?? "",
  };
}

function getManualEntryInfoFromEntry(entry: Entry): ManualEntryInfo {
  return {
    ...getBaseEntryInfoFromEntry(entry),
    type: "manualEntries",
    activityModelId: entry.activityModelId,
  };
}

function isManualEntry(entry: Entry): boolean {
  return entry.computeMethodType !== ComputeMethodType.STANDARD;
}

function isManualEntryInfo(
  entryInfo: EntryInfoForEmissionFactorChart
): entryInfo is ManualEntryInfo {
  return entryInfo.type === "manualEntries";
}

function isEmissionFactorEntryInfo(
  entryInfo: EntryInfoForEmissionFactorChart
): entryInfo is EmissionFactorEntryInfo {
  return entryInfo.type === "emissionFactor";
}

export {
  getEmissionFactorEntryInfoFromEntry,
  getManualEntryInfoFromEntry,
  isManualEntry,
  isManualEntryInfo,
  isEmissionFactorEntryInfo,
  getSumOfEntryInfoForEmissionFactorChart,
};
