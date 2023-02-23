import { RootState } from "@reducers/index";

const selectColumnViewOffset = (state: RootState) =>
  state.dataImport.tableSettings.columnViewOffset;

export default selectColumnViewOffset;
