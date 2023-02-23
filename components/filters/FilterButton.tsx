import cx from "classnames";
import styles from "@styles/filters/filterButton.module.scss";

interface Props {
  filterNumber: number;
  onClick: () => void;
}

const FilterButton = ({ filterNumber, onClick }: Props) => {
  return (
    <button className={cx("button-2", styles.filterButton)} onClick={onClick}>
      <img src="/icons/icon-filter.svg"></img>
      {filterNumber > 0 && <div className={styles.numberBadge}>{filterNumber}</div>}
    </button>
  );
};

export default FilterButton;
