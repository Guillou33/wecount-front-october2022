import useDisableBodyScroll from "@hooks/utils/useDisableBodyScroll";

import styles from "@styles/filters/filterModale.module.scss";
import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  onClose: () => void;
  children: JSX.Element | JSX.Element[];
}

const FilterModale = ({ onClose, children }: Props) => {
  useDisableBodyScroll();

  return (
    <div className={styles.filterModale}>
      <div className={styles.header}>
        <button onClick={onClose} className={styles.closeButton}>
          <i className="fa fa-times"></i>
        </button>
        <p className={styles.title}>{upperFirst(t("filter.filters"))}</p>
      </div>
      {children}
    </div>
  );
};

export default FilterModale;
