import useSetOnceEntryTags from "@hooks/core/reduxSetOnce/useSetOnceEntryTags";
import { EntryUpdate } from "@components/campaign/detail/activity/sub/activity-entries/EntryCard";

import TagMultiSelect from "@components/core/TagMultiSelect";

interface Props {
  tagIds: number[];
  save: (data: EntryUpdate) => void;
  disabled?: boolean;
}

const ActivityEntryTagsSelector = ({
  tagIds,
  save,
  disabled = false,
}: Props) => {
  useSetOnceEntryTags();

  return (
    <TagMultiSelect
      selectedTagIds={tagIds}
      disabled={disabled}
      onChange={entryTagIds => save({ entryTagIds })}
    />
  );
};

export default ActivityEntryTagsSelector;
