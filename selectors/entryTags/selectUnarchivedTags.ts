import { createSelector } from "reselect";

import { EntryTagList } from "@reducers/core/entryTagReducer";

import { RootState } from "@reducers/index";

const selectUnarchivedTags = createSelector(
  [(state: RootState) => state.core.entryTag.entryTagList],
  entryTagList => {
    return Object.values(entryTagList).reduce((acc, tag) => {
      if (tag.archivedDate == null) {
        acc[tag.id] = tag;
      }
      return acc;
    }, {} as EntryTagList);
  }
);

export default selectUnarchivedTags;