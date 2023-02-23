import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { SiteList, SubSite } from "@reducers/core/siteReducer";
import { Site } from "@reducers/core/siteReducer";
import { upperFirst } from "lodash";
import { t } from "i18next";

function useAllSites({ includeArchived = false } = {}): Site[] {
  const siteList = useSelector<RootState, SiteList>(
    state => state.core.site.siteList
  );

  const sites = Object.values(siteList).filter(
    site => includeArchived || site.archivedDate === null
  );

  const notAffectedSite: Site = {
    id: -1,
    name: upperFirst(t("site.notAffectedSite.name")),
    archivedDate: null,
    createdAt: "",
    description: upperFirst(t("site.notAffectedSite.description")),
  };

  return [...sites, notAffectedSite];
}

export default useAllSites;
