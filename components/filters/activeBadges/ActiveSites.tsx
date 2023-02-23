import { useDispatch, useSelector } from "react-redux";

import useAllSiteList from "@hooks/core/useAllSiteList";
import { SearchableFilterName } from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";
import ActiveFilterBadge from "./ActiveFilterBadge";

import { toggleSearchableFilterPresence } from "@actions/filters/filtersAction";

interface Props {
  filterName: SearchableFilterName;
}

const ActiveSites = ({ filterName }: Props) => {
  const dispatch = useDispatch();

  const allSiteList = useAllSiteList({ includeSubSites: true });
  const selectedSites = useSelector(
    (state: RootState) => state.filters[filterName].elementIds
  );
  return (
    <>
      {Object.keys(selectedSites).map(siteId => (
        <ActiveFilterBadge
          key={siteId}
          onRemoveClick={() =>
            dispatch(
              toggleSearchableFilterPresence({
                filterName,
                elementId: Number(siteId),
              })
            )
          }
        >
          <>
            <img
              src="/icons/modale/icon-map-pin.svg"
              alt=""
              className="mr-1 mb-1"
            />
            {allSiteList[Number(siteId)]?.name}
          </>
        </ActiveFilterBadge>
      ))}
    </>
  );
};

export default ActiveSites;
