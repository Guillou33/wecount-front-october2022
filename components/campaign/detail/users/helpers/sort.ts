import { UserEmission } from "@custom-types/core/Users"

export enum SortFields {
  NAME,
  RESULT_TCO2,
  OWNER,
  WRITER
};

export const sortMethods: {
  [sortField in SortFields]: (a: UserEmission, b: UserEmission) => number
} = {
  [SortFields.NAME]: (a, b) => {
    return (a.name?.toLowerCase() ?? '') <= (b.name?.toLowerCase() ?? '') ? -1 : 1
  },
  [SortFields.RESULT_TCO2]: (a, b) => {
    return a.tCo2 <= b.tCo2 ? -1 : 1
  },
  [SortFields.OWNER]: (a, b) => {
    return a.asOwner.nbByStatus.IN_PROGRESS <= b.asOwner.nbByStatus.IN_PROGRESS ? -1 : 1
  },
  [SortFields.WRITER]: (a, b) => {
    return a.asWriter.nbByStatus.IN_PROGRESS < b.asWriter.nbByStatus.IN_PROGRESS ? -1 : 1
  },
}