import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { SearchableFilterName } from "@reducers/filters/filtersReducer";

import useAllEntryTags from "@hooks/core/useAllEntryTags";
import useSetOnceEntryTags from "@hooks/core/reduxSetOnce/useSetOnceEntryTags";

import FilterElement from "./FilterElement";
import SearchableFilter from "./SearchableFilter";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";
import { toggleSearchableFilterPresence } from "@actions/filters/filtersAction";

import styles from "@styles/filters/filterElement.module.scss";
import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  filterName: SearchableFilterName;
}

const EntryTagFilter = ({ filterName }: Props) => {
  const dispatch = useDispatch();
  useSetOnceEntryTags();
  const allEntryTags = useAllEntryTags();
  const selectedTags = useSelector(
    (state: RootState) => state.filters[filterName].elementIds
  );

  const isLongList = allEntryTags.length > 10;
  const title = upperFirst(t("tag.tags"));

  return isLongList ? (
    <SearchableFilter
      filterName={filterName}
      ressources={allEntryTags}
      title={title}
    />
  ) : (
    <FilterElement title={title}>
      <>
        {allEntryTags.map(entryTag => (
          <CheckboxInput
            id={`${filterName}-${entryTag.id}`}
            key={entryTag.id}
            checked={!!selectedTags[entryTag.id]}
            onChange={() =>
              dispatch(
                toggleSearchableFilterPresence({
                  filterName: filterName,
                  elementId: entryTag.id,
                })
              )
            }
            className={styles.filter}
            labelClassName={styles.label}
          >
            {entryTag.name}
          </CheckboxInput>
        ))}
      </>
    </FilterElement>
  );
};

export default EntryTagFilter;
