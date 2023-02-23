import cx from "classnames";

import DefaultContainer, { Props as BaseProps } from "./DefaultContainer";

import styles from "@styles/helpers/ui/selects/selectionContainer.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props extends Omit<BaseProps, "icon"> {
  searchedValue: string;
  setSearchedValue: (value: string) => void;
  searchInputClassName?: string;
}

const SearchContainer = ({
  placeholder = `${upperFirst(t("global.search"))}...`,
  searchedValue,
  setSearchedValue,
  searchInputClassName,
  ...props
}: Props) => {
  const inputFocusRef = (input: HTMLInputElement | null) => {
    input?.focus();
  };
  return (
    <DefaultContainer
      {...props}
      placeholder={placeholder}
      onClick={() => {
        if (!props.disabled) {
          setTimeout(() => props.setOpened(true));
        }
      }}
      icon={<i className="fa fa-search"></i>}
    >
      {props.opened ? (
        <input
          ref={inputFocusRef}
          type="search"
          value={searchedValue}
          onChange={e => setSearchedValue(e.target.value)}
          className={cx(styles.searchInput, searchInputClassName)}
          placeholder={typeof placeholder === "string" ? placeholder : `${upperFirst(t("global.search"))}...`}
        />
      ) : (
        props.children
      )}
    </DefaultContainer>
  );
};

export default SearchContainer;
