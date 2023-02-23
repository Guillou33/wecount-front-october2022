import { EntryDataKey } from "@lib/core/dataImport/columnConfig";

import Foldable from "@components/helpers/form/Foldable";
import SearchColumnPopover from "@components/campaign/data-import/sub/data-filters/SearchColumnPopover";
import SearchSuggestion from "@components/campaign/data-import/sub/data-filters/SearchSuggestion";

interface Props {
  isOpen: boolean;
  entryDataKey: EntryDataKey;
}

const ColumnFilter = ({ isOpen, entryDataKey }: Props) => {
  return (
    <Foldable isOpen={isOpen}>
      <SearchColumnPopover entryDataKey={entryDataKey}>
        {(filterOption, onFilterOptionChange) => (
          <SearchSuggestion
            entryDataKey={entryDataKey}
            searchedValue={filterOption.value}
            onSuggestionClick={value => onFilterOptionChange({ value }, true)}
          />
        )}
      </SearchColumnPopover>
    </Foldable>
  );
};

export default ColumnFilter;
