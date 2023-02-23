import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootState } from "@reducers/index";
import { EntryDataKey } from "@lib/core/dataImport/columnConfig";
import { FilterOption } from "@reducers/dataImport/dataFiltersReducer";
import getEmptyFilterOption from "@lib/core/dataImport/dataFilter/getEmptyFilterOption";

import { setColumnFilter } from "@actions/dataImport/dataFilters/dataFiltersActions";

import BufferedSearchInput from "@components/helpers/form/field/BufferedSearchInput";
import { DropdownUncontrolled } from "@components/helpers/ui/dropdown/Dropdown";

import styles from "@styles/campaign/data-import/sub/data-filters/columnFilter.module.scss";

interface Props {
  entryDataKey: EntryDataKey;
  children?: (
    filterOption: FilterOption,
    onFilterOptionChange: (
      filterOption: Partial<FilterOption>,
      closeRequested: boolean
    ) => void
  ) => React.ReactNode;
}

const SearchColumnPopover = ({ entryDataKey, children }: Props) => {
  const dispatch = useDispatch();

  const filterOption = useSelector<RootState, FilterOption>(
    state =>
      state.dataImport.dataFilters.filterOptions[entryDataKey] ??
      getEmptyFilterOption()
  );

  const [isOpened, setIsOpened] = useState(false);

  function onFilterChange(
    filterOption: Partial<FilterOption>,
    closeRequested: boolean = false
  ) {
    if (closeRequested) {
      setIsOpened(false);
    }
    dispatch(setColumnFilter({ column: entryDataKey, filterOption }));
  }

  return (
    <DropdownUncontrolled
      opened={isOpened}
      onClose={() => setIsOpened(false)}
      onOpen={() => setIsOpened(true)}
      togglerContent={
        <BufferedSearchInput
          value={filterOption.value}
          onEndTyping={value => {
            onFilterChange({ value });
          }}
          className={styles.searchBox}
          inputClassName={styles.input}
        />
      }
      togglerClassName={styles.toggler}
      itemContainerClassName={styles.itemContainer}
      closeOnClickInside={false}
    >
      {children?.(filterOption, onFilterChange)}
    </DropdownUncontrolled>
  );
};

export default SearchColumnPopover;
