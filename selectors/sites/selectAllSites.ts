import { createSelector } from "reselect";

import { RootState } from "@reducers/index";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { Site } from "@reducers/core/siteReducer";

const selectAllSites = createSelector(
  [(state: RootState) => state.core.site.siteList],
  sites =>
    {
      const notAffectedSite: Site = {
        id: -1,
        name: upperFirst(t("site.notAffectedSite.name")),
        archivedDate: null,
        createdAt: "",
        description: upperFirst(t("site.notAffectedSite.description")),
      };
      return [...Object.values(sites).filter(site => site.archivedDate == null), notAffectedSite];
    }
);

export default selectAllSites;
