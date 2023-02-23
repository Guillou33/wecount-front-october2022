import { createSelector } from "reselect";

import { getNameHashMap } from "@lib/utils/getNameHashMap";

import { RootState } from "@reducers/index";

const selectAllProductsByName = createSelector(
  [(state: RootState) => state.core.product.productList],
  products =>
    getNameHashMap(
      Object.values(products).filter(product => product.archivedDate == null)
    )
);

export default selectAllProductsByName;
