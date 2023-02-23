import { createSelector } from "reselect";

import selectCartographyForCampaign from "@selectors/cartography/selectCartographyForCampaign";

const selectCategoriesInCartographyForCampaign = createSelector(
  selectCartographyForCampaign,
  cartography => {
    return {
      ...cartography.UPSTREAM,
      ...cartography.CORE,
      ...cartography.DOWNSTREAM,
    };
  }
);

export default selectCategoriesInCartographyForCampaign;
