import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import {
  StatusHashMapFilterName,
  PresenceHashMap,
} from "@reducers/filters/filtersReducer";
import useSetOnceSites from "@hooks/core/reduxSetOnce/useSetOnceSites";

import FilterElement from "./FilterElement";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";
import { toggleStatusPresence } from "@actions/filters/filtersAction";

import { Status } from "@custom-types/core/Status";
import StatusBadge from "@components/core/StatusBadge";

import styles from "@styles/filters/filterElement.module.scss";
import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  filterName: StatusHashMapFilterName;
}

const availableStatuses = [Status.IN_PROGRESS, Status.TO_VALIDATE, Status.TERMINATED];

const SiteFilter = ({ filterName }: Props) => {
  const dispatch = useDispatch();
  useSetOnceSites();
  const selectedStatus = useSelector<RootState, PresenceHashMap<Status>>(
    state => state.filters[filterName]
  );

  return (
    <FilterElement title={upperFirst(t("status.status.plural"))}>
      <>
        {availableStatuses.map(status => (
          <CheckboxInput
            id={`${filterName}-${status}`}
            key={status}
            checked={!!selectedStatus[status]}
            onChange={() =>
              dispatch(toggleStatusPresence({ filterName, status }))
            }
            className={styles.filter}
            labelClassName={styles.label}
          >
            <StatusBadge status={status} />
          </CheckboxInput>
        ))}
      </>
    </FilterElement>
  );
};

export default SiteFilter;
