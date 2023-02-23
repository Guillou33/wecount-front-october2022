import { forwardRef } from "react";
import cx from "classnames";

import styles from "@styles/helpers/form/field/searchInput.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

export interface Props extends Omit<React.HTMLProps<HTMLInputElement>, "ref"> {
  value: string | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  inputClassName?: string;
}

const SearchInput = forwardRef<HTMLInputElement, Props>(
  (
    {
      value,
      onChange,
      placeholder = `${upperFirst(t("global.search"))}...`,
      className = "",
      inputClassName,
      ...inputProps
    },
    ref
  ) => {
    return (
      <div className={cx("default-field", styles.searchInput, className)}>
        <div className={cx("field", styles.searchInputContainer)}>
          <input
            ref={ref}
            {...inputProps}
            type="search"
            value={value}
            placeholder={placeholder}
            className={cx(styles.input, inputClassName)}
            onChange={onChange}
          />
          <i className={cx("fa fa-search", styles.searchIcon)}></i>
        </div>
      </div>
    );
  }
);

export default SearchInput;
