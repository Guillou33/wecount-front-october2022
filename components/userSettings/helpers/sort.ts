import { Site } from "@reducers/core/siteReducer"

export enum SortFields {
  NAME,
  DESCRIPTION,
};

export const sortMethods: {
  [sortField in SortFields]: (a: Site, b: Site) => number
} = {
  [SortFields.NAME]: (a, b) => {
    return (a.name.toLowerCase()) <= (b.name.toLowerCase()) ? -1 : 1
  },
  [SortFields.DESCRIPTION]: (a, b) => {
    return (a.description ? a.description.toLowerCase() : "") <= (b.description ? b.description.toLowerCase() : "") ? -1 : 1
  },
}