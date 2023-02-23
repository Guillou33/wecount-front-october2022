import { useDispatch, useSelector } from "react-redux";

import selectCategoriesInCartography from "@selectors/cartography/selectCategoriesInCartography";
import {
  SearchableFilterName,
  PresenceHashMap,
} from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";

import ActiveFilterBadge from "./ActiveFilterBadge";

import { toggleSearchableFilterPresence } from "@actions/filters/filtersAction";

interface Props {
  filterName: SearchableFilterName;
}

const ActiveCategories = ({ filterName }: Props) => {
  const dispatch = useDispatch();

  const categories = useSelector((state: RootState) =>
    selectCategoriesInCartography(state)
  );

  const selectedCategories = useSelector<
    RootState,
    PresenceHashMap<number>
  >(state => state.filters[filterName].elementIds);
  return (
    <>
      {Object.keys(selectedCategories).map(categoryId => (
        <ActiveFilterBadge
          key={categoryId}
          onRemoveClick={() =>
            dispatch(
              toggleSearchableFilterPresence({
                filterName,
                elementId: Number(categoryId),
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
            {categories?.[Number(categoryId)]?.name}
          </>
        </ActiveFilterBadge>
      ))}
    </>
  );
};

export default ActiveCategories;
