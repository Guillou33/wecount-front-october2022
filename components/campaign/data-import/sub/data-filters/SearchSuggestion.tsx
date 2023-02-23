import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { Virtuoso } from "react-virtuoso";
import { RootState } from "@reducers/index";
import cx from "classnames";

import { EntryDataKey } from "@lib/core/dataImport/columnConfig";
import selectSearchSuggestions from "@selectors/dataImport/filteredEntryData/selectSearchSuggestions";

import Highlight from "@components/helpers/Highlight";

import styles from "@styles/campaign/data-import/sub/data-filters/searchSuggestion.module.scss";

interface Props {
  entryDataKey: EntryDataKey;
  searchedValue: string;
  onSuggestionClick: (value: string) => void;
}

const SearchSuggestion = ({
  entryDataKey,
  searchedValue,
  onSuggestionClick,
}: Props) => {
  const suggestions = useSelector<RootState, string[]>(
    selectSearchSuggestions[entryDataKey] ?? (() => [])
  );
  const isLongList = suggestions.length > 20;
  return (
    <div
      className={cx({
        [styles.searchSuggestionFixedHeight]: isLongList,
        [styles.searchSuggestionFluidHeight]: !isLongList,
      })}
    >
      <div className={styles.title}>
        {upperFirst(t("dataImport.dataFilters.searchPopover.suggestionTitle"))}
      </div>
      {(() => {
        if (isLongList) {
          return (
            <Virtuoso
              className={styles.suggestionContainer}
              data={suggestions}
              itemContent={(i, suggestion) => (
                <div
                  className={cx(styles.suggestion, {
                    [styles.active]:
                      suggestion.toLowerCase() === searchedValue.toLowerCase(),
                  })}
                  onClick={e => {
                    e.stopPropagation();
                    onSuggestionClick(suggestion);
                  }}
                >
                  <Highlight search={searchedValue}>{suggestion}</Highlight>
                </div>
              )}
            />
          );
        }
        if (suggestions.length === 0) {
          return (
            <div className={styles.noResults}>
              {upperFirst(t("dataImport.dataFilters.searchPopover.noResults"))}
            </div>
          );
        }
        return suggestions.map(suggestion => (
          <div
            className={cx(styles.suggestion, {
              [styles.active]:
                suggestion.toLowerCase() === searchedValue.toLowerCase(),
            })}
            onClick={e => {
              e.stopPropagation();
              onSuggestionClick(suggestion);
            }}
          >
            <Highlight search={searchedValue}>{suggestion}</Highlight>
          </div>
        ));
      })()}
    </div>
  );
};

export default SearchSuggestion;
