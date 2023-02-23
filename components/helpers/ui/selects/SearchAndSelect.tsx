import SelectOne, { Props as OptionProps } from "./SelectOne";
import { Index } from "./MultiSelect";
import SearchContainer from "./selectionContainers/SearchContainer";

import styles from "@styles/helpers/ui/selects/searchAndSelect.module.scss";
import { t } from "i18next";

interface Props<T extends Index> extends OptionProps<T> {
  searchedValue: string;
  setSearchedValue: (value: string) => void;
}

const SearchAndSelect = <T extends Index>({
  searchedValue,
  setSearchedValue,
  children,
  ...props
}: Props<T>) => {
  return (
    <SelectOne
      {...props}
      renderSelectionContainer={ctx => {
        return (
          <SearchContainer
            {...ctx}
            searchedValue={searchedValue}
            setSearchedValue={setSearchedValue}
          />
        );
      }}
    >
      {context => {
        const renderedChildren = children(context);
        if (renderedChildren.props.children.length === 0) {
          return <div className={styles.noResults}>{t("global.noResult")}</div>;
        }
        return renderedChildren;
      }}
    </SelectOne>
  );
};

export default SearchAndSelect;
