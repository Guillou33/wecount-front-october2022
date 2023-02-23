import { forwardRef } from "react";
import cx from "classnames";

import styles from "@styles/dashboard/campaign/sub/historyTable/headerCell.module.scss";

export type ActiveStatus = "inactive" | "active-asc" | "active-desc";

interface Props {
  activeStatus: ActiveStatus;
  onSort: () => void;
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const HeaderCell = forwardRef<HTMLTableCellElement, Props>(
  (
    { activeStatus, onSort, children, className, style = {} }: Props,
    ref
  ) => {
    return (
      <th
        ref={ref}
        className={cx(
          "header-clickable",
          styles.headerCell,
          className,
          {
            ["active"]: activeStatus !== "inactive",
          }
        )}
        onClick={onSort}
        style={style}
      >
        <div className={styles.headerCellContent}>
          {children}
          <div className={styles.sortCarets}>
            <i
              className={cx("fas fa-caret-up", {
                [styles.active]: activeStatus === "active-asc",
              })}
            />
            <i
              className={cx("fas fa-caret-down", {
                [styles.active]: activeStatus === "active-desc",
              })}
            />
          </div>
        </div>
      </th>
    );
  }
);

export default HeaderCell;
