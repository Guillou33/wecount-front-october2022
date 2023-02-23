import { RootState } from "@reducers/index";

const selectEntryDataSelection = (state: RootState) =>
  state.dataImport.entryDataSelection;

export default selectEntryDataSelection;
