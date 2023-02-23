import cx from "classnames";

import styles from "@styles/admin/dashboard/company-list/common/searchCompanyInput.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
}

const SearchCompanyInput = ({value, onChange}: Props) => {
  return (
    <div className={cx("default-field", styles.searchCompanyInput)}>
      <div className={cx("field", styles.searchInputContainer)}>
        <input
          type="search"
          value={value}
          placeholder={`${upperFirst(t("company.search.search"))}...`}
          className={cx(styles.searchInput)}
          onChange={onChange}
        />
        <i className={cx("fa fa-search", styles.searchIcon)}></i>
      </div>
    </div>
  );
};

export default SearchCompanyInput;
