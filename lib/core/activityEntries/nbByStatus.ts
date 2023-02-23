import { Status } from "@custom-types/core/Status";

export type NbByStatus = Record<Status, number>;

function getInitialNbByStatus(): NbByStatus {
  return {
    [Status.IN_PROGRESS]: 0,
    [Status.TO_VALIDATE]: 0,
    [Status.TERMINATED]: 0,
    [Status.ARCHIVED]: 0,
  };
}

function getNbByStatusSum(
  nbByStatusA: NbByStatus,
  nbByStatusB: NbByStatus
): NbByStatus {
  return {
    [Status.IN_PROGRESS]: nbByStatusA.IN_PROGRESS + nbByStatusB.IN_PROGRESS,
    [Status.TO_VALIDATE]: nbByStatusA.TO_VALIDATE + nbByStatusB.TO_VALIDATE,
    [Status.TERMINATED]: nbByStatusA.TERMINATED + nbByStatusB.TERMINATED,
    [Status.ARCHIVED]: nbByStatusA.ARCHIVED + nbByStatusB.ARCHIVED,
  };
}

export { getInitialNbByStatus, getNbByStatusSum };
