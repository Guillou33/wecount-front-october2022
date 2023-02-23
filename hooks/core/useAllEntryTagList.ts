import { EntryTagList } from "@reducers/core/entryTagReducer";
import useAllEntryTags from "@hooks/core/useAllEntryTags";

export default function useAllSiteList({ includeArchived = false } = {}): EntryTagList {
  const allEntryTags = useAllEntryTags({ includeArchived });

  return allEntryTags.reduce((entryTagList, entryTag) => {
    entryTagList[entryTag.id] = { ...entryTag };
    return entryTagList;
  }, {} as EntryTagList);
}
