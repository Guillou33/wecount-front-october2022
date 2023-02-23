import { useSelector } from "react-redux";

import makeIsSelectedEntryData from "@lib/core/dataImport/makeIsSelectedEntryData";
import selectEntryDataSelection from "@selectors/dataImport/entryDataSelection/selectEntryDataSelection";

function useEntryDataSelectionComputer() {
  const entryDataSelectionState = useSelector(selectEntryDataSelection);

  return makeIsSelectedEntryData(entryDataSelectionState);
}

export default useEntryDataSelectionComputer;
