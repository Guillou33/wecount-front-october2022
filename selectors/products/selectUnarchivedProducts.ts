import { createSelector } from "reselect";

import { ProductList } from "@reducers/core/productReducer";

import { RootState } from "@reducers/index";

const selectUnarchivedProducts = createSelector(
  [(state: RootState) => state.core.product.productList],
  productList => {
    return Object.values(productList).reduce((acc, product) => {
      if (product.archivedDate == null) {
        acc[product.id] = product;
      }
      return acc;
    }, {} as ProductList);
  }
);

export default selectUnarchivedProducts;