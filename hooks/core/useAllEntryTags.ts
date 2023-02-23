import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { EntryTagList  } from "@reducers/core/entryTagReducer";
import { EntryTagResponse } from "@lib/wecount-api/responses/apiResponses";
import { upperFirst } from "lodash";
import { t } from "i18next";


function useAllEntryTags({ includeArchived = false } = {}): EntryTagResponse[] {
  const entryTagList = useSelector<RootState, EntryTagList>(
    state => state.core.entryTag.entryTagList
  );

  const entryTags = Object.values(entryTagList).filter(
    tag => includeArchived || tag.archivedDate === null
  );
  const notTagged: EntryTagResponse = {
    id: -1,
    name: upperFirst(t("tag.untagged.plural")),
    archivedDate: null,
    createdAt: "",
  };

  return [...entryTags, notTagged];
}

export default useAllEntryTags;
