import { createSelector } from "reselect";

import { getNameHashMap } from "@lib/utils/getNameHashMap";

import { RootState } from "@reducers/index";

const selectAllSitesByName = createSelector(
  [(state: RootState) => state.core.site.siteList],
  sites =>
    getNameHashMap(
      Object.values(sites).filter(site => site.archivedDate == null)
    )
);

export default selectAllSitesByName;
