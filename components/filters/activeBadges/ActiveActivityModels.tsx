import { useDispatch, useSelector } from "react-redux";

import selectAllActivityModelsRecord from "@selectors/activityModels/selectAllActivityModelsRecord";
import {
  SearchableFilterName,
  PresenceHashMap,
} from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";

import useCategoryInfo from "@hooks/core/useCategoryInfo";

import ActiveFilterBadge from "./ActiveFilterBadge";

import { toggleSearchableFilterPresence } from "@actions/filters/filtersAction";

interface Props {
  filterName: SearchableFilterName;
}

const ActiveActivityModels = ({ filterName }: Props) => {
  const dispatch = useDispatch();

  const categories = useCategoryInfo();

  const activityModels = useSelector((state: RootState) =>
    selectAllActivityModelsRecord(state)
  );

  const selectedActivityModels = useSelector<
    RootState,
    PresenceHashMap<number>
  >(state => state.filters[filterName].elementIds);
  return (
    <>
      {Object.keys(selectedActivityModels).map(activityModelId => (
        <ActiveFilterBadge
          key={activityModelId}
          onRemoveClick={() =>
            dispatch(
              toggleSearchableFilterPresence({
                filterName,
                elementId: Number(activityModelId),
              })
            )
          }
        >
          <>
            <img
              src="/icons/modale/icon-emission-gef.svg"
              alt=""
              className="mr-1 mb-1"
            />
            {categories[activityModels?.[Number(activityModelId)]?.categoryId]?.name}{" - "}
            {activityModels?.[Number(activityModelId)]?.name}
          </>
        </ActiveFilterBadge>
      ))}
    </>
  );
};

export default ActiveActivityModels;
