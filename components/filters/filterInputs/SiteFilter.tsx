import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { SearchableFilterName } from "@reducers/filters/filtersReducer";

import useAllSites from "@hooks/core/useAllSites";
import useSetOnceSites from "@hooks/core/reduxSetOnce/useSetOnceSites";

import FilterElement from "./FilterElement";
import SearchableFilter from "./SearchableFilter";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";
import { toggleSearchableFilterPresence } from "@actions/filters/filtersAction";

import styles from "@styles/filters/filterElement.module.scss";
import { t } from "i18next";
import useAllSubSites from "@hooks/core/useAllSubSites";
import SubSiteFilter from "./SubSiteFilter";
import { upperFirst } from "lodash";

interface Props {
  filterName: SearchableFilterName;
}

const SiteFilter = ({ filterName }: Props) => {
  const dispatch = useDispatch();
  useSetOnceSites();
  const allSites = useAllSites();
  const allSubSites = useAllSubSites();
  const selectedSites = useSelector(
    (state: RootState) => state.filters[filterName].elementIds
  );

  const sites = allSites.filter(site => site.id === -1 || !allSubSites.map(subSite => subSite.id).includes(site.id))
  

  const isLongList = allSites.length > 10;
  const title = upperFirst(t("site.site"));

  return isLongList ? (
    <SearchableFilter
      filterName={filterName}
      ressources={allSites}
      title={title}
    />
  ) : (
    <FilterElement title={title}>
      <>
        {sites.map(site => {
          const hasSubSites = site.id !== -1 || site.subSites !== undefined;
          return (
            <>
              <CheckboxInput
                id={`${filterName}-${site.id}`}
                key={site.id}
                checked={!!selectedSites[site.id]}
                onChange={() =>
                  dispatch(
                    toggleSearchableFilterPresence({
                      filterName: filterName,
                      elementId: site.id,
                    })
                  )
                }
                className={styles.filter}
                labelClassName={styles.label}
              >
                {site.name}
              </CheckboxInput>
              {hasSubSites && (<SubSiteFilter site={site} filterName={filterName} />)}
            </>
          )}
        )}
      </>
    </FilterElement>
  );
};

export default SiteFilter;
