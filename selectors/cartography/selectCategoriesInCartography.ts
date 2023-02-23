import { createSelector } from "reselect";

import selectCartography from "./selectCartography";

const selectCategoriesInCartography = createSelector(
  selectCartography,
  cartography => {
    return {
      ...cartography.UPSTREAM,
      ...cartography.CORE,
      ...cartography.DOWNSTREAM,
    };
  }
);

export default selectCategoriesInCartography;
