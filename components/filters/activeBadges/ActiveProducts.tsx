import { useDispatch, useSelector } from "react-redux";

import useAllProductList from "@hooks/core/useAllProductList";
import { SearchableFilterName } from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";
import ActiveFilterBadge from "./ActiveFilterBadge";

import { toggleSearchableFilterPresence } from "@actions/filters/filtersAction";

interface Props {
  filterName: SearchableFilterName;
}

const ActiveSites = ({ filterName }: Props) => {
  const dispatch = useDispatch();

  const allProductList = useAllProductList();
  const selectedProducts = useSelector(
    (state: RootState) => state.filters[filterName].elementIds
  );
  return (
    <>
      {Object.keys(selectedProducts).map(productId => (
        <ActiveFilterBadge
          key={productId}
          onRemoveClick={() =>
            dispatch(
              toggleSearchableFilterPresence({
                filterName,
                elementId: Number(productId),
              })
            )
          }
        >
          <>
            <img
              src="/icons/modale/icon-box.svg"
              alt=""
              className="mr-1 mb-1"
            />
            {allProductList[Number(productId)]?.name}
          </>
        </ActiveFilterBadge>
      ))}
    </>
  );
};

export default ActiveSites;
