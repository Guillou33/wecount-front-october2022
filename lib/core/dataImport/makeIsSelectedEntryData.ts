import { State as SelectionState } from "@reducers/dataImport/entryDataSelectionReducer";

function makeIsSelectedEntryData(entryDataSelection: SelectionState) {
  const { markedEntryData, selectedAre } = entryDataSelection;
  return (entryDataId: string) => {
    if (selectedAre === "markedEntries") {
      return markedEntryData[entryDataId] != null;
    } else {
      return markedEntryData[entryDataId] == null;
    }
  };
}

export default makeIsSelectedEntryData;
