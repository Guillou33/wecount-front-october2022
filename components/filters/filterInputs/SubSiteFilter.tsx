import { Site } from "@reducers/core/siteReducer";
import FilterElement from "./FilterElement";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";
import { toggleIdPresence, toggleSearchableFilterPresence } from "@actions/filters/filtersAction";
import { useDispatch, useSelector } from "react-redux";
import useAllSubSites from "@hooks/core/useAllSubSites";
import { RootState } from "@reducers/index";
import { IdHashMapFilterName, PresenceHashMap, SearchableFilterName } from "@reducers/filters/filtersReducer";
import styles from "@styles/filters/filterElement.module.scss";
import useSubSitesInSite from "@hooks/core/useSubSitesInSite";

interface Props{
    site: Site;
    filterName: SearchableFilterName;
}

const SubSiteFilter = ({
    site,
    filterName
}: Props) => {
    const dispatch = useDispatch(); 
    const allSubSites = useSubSitesInSite({}, site);
    const selectedSites = useSelector<RootState, PresenceHashMap<number>>(
      state => state.filters[filterName].elementIds
    );
    const unallocatedSubSite = allSubSites.length > 0 && allSubSites[0].id === -1;

    return (
        <>
            {(allSubSites !== undefined && !unallocatedSubSite) && (
                <div style={{marginLeft: 20}}>
                    {allSubSites.filter(subSite => subSite.id !== -1).map(subSite => {
                        return (
                            <CheckboxInput
                                id={`${filterName}-${subSite.id}`}
                                key={subSite.id}
                                checked={!!selectedSites[subSite.id]}
                                onChange={() =>
                                    dispatch(
                                        toggleSearchableFilterPresence({
                                            filterName: filterName,
                                            elementId: subSite.id,
                                        })
                                    )
                                }
                                className={styles.filter}
                                labelClassName={styles.label}
                            >
                                {subSite.name}
                            </CheckboxInput>
                        );
                    })}
                </div>
            )}
        </>
    )
};

export default SubSiteFilter;