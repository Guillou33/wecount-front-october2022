import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";

import { SearchableFilterName } from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";
import selectSearchableFilter from "@selectors/filters/selectSearchableFilter";
import {
  setSearchTerm,
  toggleSearchableFilterPresence,
} from "@actions/filters/filtersAction";

import FilterElement from "./FilterElement";
import InputAddon from "@components/helpers/form/field/InputAddon";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";
import Highlight from "@components/helpers/Highlight";

import styles from "@styles/filters/searchableFilter.module.scss";
import elementStyles from "@styles/filters/filterElement.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  title: string;
  filterName: SearchableFilterName;
  ressources: { id: number; name: string }[];
  showAllWhenNotfiltered?: boolean;
}

const SearchableFilter = ({
  title,
  filterName,
  ressources,
  showAllWhenNotfiltered = false,
}: Props) => {
  const dispatch = useDispatch();

  const { searchedTerm, elementIds: selectedRessources } = useSelector(
    (state: RootState) => selectSearchableFilter(state, filterName)
  );

  const lowercasedsearchedTerm = searchedTerm.toLowerCase();

  const filteredRessources =
    searchedTerm !== "" || showAllWhenNotfiltered
      ? ressources.filter(
          emissionFactor =>
            selectedRessources[emissionFactor.id] ||
            emissionFactor.name.toLowerCase().includes(lowercasedsearchedTerm)
        )
      : [];

  const onChangeSearchedTerm = (value: string) =>
    dispatch(setSearchTerm({ filterName, value }));

  return (
    <FilterElement title={upperFirst(title)}>
      <>
        <InputAddon
          addonRight={<i className={cx("fa fa-search", styles.searchIcon)}></i>}
          value={searchedTerm}
          onLocalChange={onChangeSearchedTerm}
          className={styles.searchBox}
          inputClassName={styles.searchInput}
          placeholder={`${upperFirst(t("global.search"))}...`}
        />
        {filteredRessources.map(ressource => (
          <CheckboxInput
            checked={!!selectedRessources[ressource.id]}
            id={`${filterName}-${ressource.id}`}
            key={`${filterName}-${ressource.id}`}
            onChange={() =>
              dispatch(
                toggleSearchableFilterPresence({
                  filterName,
                  elementId: ressource.id,
                })
              )
            }
            className={elementStyles.filter}
            labelClassName={elementStyles.label}
          >
            <div>
              {selectedRessources[ressource.id] ? (
                ressource.name
              ) : (
                <Highlight search={searchedTerm}>{ressource.name}</Highlight>
              )}
            </div>
          </CheckboxInput>
        ))}
        {filteredRessources.length === 0 && searchedTerm !== "" && (
          <div className={elementStyles.noResults}>
            {upperFirst(t("filter.search.noMatch", {thing: title}))}
          </div>
        )}
      </>
    </FilterElement>
  );
};

export default SearchableFilter;
