import { Status } from "@custom-types/core/Status";

export interface ActivityInfo {
  nb: number;
  hasInProgressStatuses: boolean;
  status: Status;
  tCo2: number;
  targetTco2: number;
  nbByStatus: {
    // [Status.NEW_ACTIVITY]: number;
    [Status.ARCHIVED]: number;
    [Status.IN_PROGRESS]: number;
    [Status.TERMINATED]: number;
    [Status.TO_VALIDATE]: number;
  };
  tco2BySites: { [key: number]: number };
  tco2ByProducts: { [key: number]: number };
  tco2BySitesAndProducts: {
    [key: string]: number;
  }
}

export const getInitialActivityInfo = (
  initialStatus: Status = Status.IN_PROGRESS
): ActivityInfo => {
  const initialNbByStatus = {
    // [Status.NEW_ACTIVITY]: 0,
    [Status.ARCHIVED]: 0,
    [Status.IN_PROGRESS]: 0,
    [Status.TERMINATED]: 0,
    [Status.TO_VALIDATE]: 0,
  };
  return {
    nb: 0,
    hasInProgressStatuses: false,
    status: initialStatus,
    tCo2: 0,
    targetTco2: 0,
    nbByStatus: { ...initialNbByStatus },
    tco2BySites: {},
    tco2ByProducts: {},
    tco2BySitesAndProducts: {},
  };
};
