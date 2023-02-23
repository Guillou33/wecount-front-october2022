import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

import { EntryTagList } from "@reducers/core/entryTagReducer";
import { RootState } from "@reducers/index";

import { setMultiEntryTags } from "@actions/dataImport/entryData/entryDataActions";

import TagMultiSelect from "@components/core/TagMultiSelect";
import BaseModale from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";

const EditAllTagsModale = () => {
  const dispatch = useDispatch();

  const [tagIds, setTagIds] = useState<number[]>([]);

  const entryTagList = useSelector<RootState, EntryTagList>(
    state => state.core.entryTag.entryTagList
  );

  const previewTags =
    tagIds.length === 0
      ? upperFirst(t("entry.unaffected"))
      : tagIds.map(tagId => entryTagList[tagId]?.name).join(", ");

  return (
    <BaseModale
      renderTitle={count =>
        upperFirst(
          t("dataImport.multiActions.actionTitles.editTags", { count })
        )
      }
      icon={<i className="fas fa-tag" />}
      onApplyButtonClick={entryDataIds => {
        dispatch(
          setMultiEntryTags({
            entryDataIds,
            tagIds,
          })
        );
      }}
      applyButtonLabel={upperFirst(t("global.modify"))}
      renderControls={
        <TagMultiSelect selectedTagIds={tagIds} onChange={setTagIds} />
      }
      previewValues={{
        tags: previewTags,
      }}
    />
  );
};

export default EditAllTagsModale;
