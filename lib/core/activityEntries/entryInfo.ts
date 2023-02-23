import { Status, STATUS_WEIGHTS } from "@custom-types/core/Status";

import {
  getInitialNbByStatus,
  NbByStatus,
  getNbByStatusSum,
} from "./nbByStatus";

import { EntryData as Entry } from "@reducers/entries/campaignEntriesReducer";

export type EntryInfo = {
  nb: number;
  hasInProgressStatuses: boolean;
  status: Status;
  tCo2: number;
  nbByStatus: NbByStatus;
};

function getInitialEntryInfo(): EntryInfo {
  return {
    nb: 0,
    hasInProgressStatuses: false,
    status: Status.ARCHIVED,
    tCo2: 0,
    nbByStatus: getInitialNbByStatus(),
  };
}

function getEntryInfoSum(entryA: EntryInfo, entryB: EntryInfo): EntryInfo {
  return {
    nb: entryA.nb + entryB.nb,
    hasInProgressStatuses:
      entryA.hasInProgressStatuses || entryB.hasInProgressStatuses,
    tCo2: entryA.tCo2 + entryB.tCo2,
    status:
      STATUS_WEIGHTS[entryA.status] < STATUS_WEIGHTS[entryB.status]
        ? entryA.status
        : entryB.status,
    nbByStatus: getNbByStatusSum(entryA.nbByStatus, entryB.nbByStatus),
  };
}

function getActivityEntryInfo(entry: Entry): EntryInfo {
  return {
    nb: 1,
    tCo2: entry.resultTco2,
    hasInProgressStatuses: entry.status === Status.IN_PROGRESS,
    status: entry.status,
    nbByStatus: {
      ...getInitialNbByStatus(),
      [entry.status]: 1,
    },
  };
}

export { getInitialEntryInfo, getEntryInfoSum, getActivityEntryInfo };
