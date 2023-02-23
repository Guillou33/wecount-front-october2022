import { EntryData } from "@reducers/entries/campaignEntriesReducer";
import { Props as EntrycardProps } from "../EntryCard";

function areEntryEquals(
  prevEntry: EntryData,
  nextEntry: EntryData
): boolean {
  return Object.entries(prevEntry).every(
    ([key, value]) => value === nextEntry[key as keyof EntryData]
  );
}

export function areEntryCardPropsEqual(
  prevProps: EntrycardProps,
  nextProps: EntrycardProps
): boolean {
  prevProps.entry;
  return (
    prevProps.isOpened === nextProps.isOpened &&
    //prevProps.isSelected === nextProps.isSelected &&
    prevProps.totalTco2 === nextProps.totalTco2 &&
    prevProps.unitMode === nextProps.unitMode &&
    areEntryEquals(prevProps.entry, nextProps.entry)
  );
}
