import { useDispatch, useSelector } from "react-redux";

import { PresenceHashMap, StatusHashMapFilterName } from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";
import ActiveFilterBadge from "./ActiveFilterBadge";
import StatusBadge from "@components/core/StatusBadge";

import { toggleStatusPresence } from "@actions/filters/filtersAction";

import { Status } from "@custom-types/core/Status";

interface Props {
  filterName: StatusHashMapFilterName;
}

const ActiveSites = ({ filterName }: Props) => {
  const dispatch = useDispatch();

  const selectedStatuses = useSelector<RootState, PresenceHashMap<Status>>(
    state => state.filters[filterName]
  );

  return (
    <>
      {(Object.keys(selectedStatuses) as Status[]).map(status => (
        <ActiveFilterBadge
          key={status}
          onRemoveClick={() =>
            dispatch(toggleStatusPresence({ filterName, status }))
          }
        >
          <StatusBadge status={status} />
        </ActiveFilterBadge>
      ))}
    </>
  );
};

export default ActiveSites;
