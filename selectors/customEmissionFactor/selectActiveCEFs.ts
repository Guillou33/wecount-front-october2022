import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

const selectActiveCEFs = createSelector(
  [(state: RootState) => state.core.customEmissionFactor.customEmissionFactors],
  customEmissionFactors => Object.values(customEmissionFactors).filter(cef => !cef.archivedDate)
);

export default selectActiveCEFs;
