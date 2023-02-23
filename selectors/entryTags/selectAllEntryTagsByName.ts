import { createSelector } from "reselect";

import { getNameHashMap } from "@lib/utils/getNameHashMap";

import { RootState } from "@reducers/index";

const selectAllEntryTagsByName = createSelector(
  [(state: RootState) => state.core.entryTag.entryTagList],
  entryTags =>
    getNameHashMap(
      Object.values(entryTags).filter(tag => tag.archivedDate == null)
    )
);

export default selectAllEntryTagsByName;
