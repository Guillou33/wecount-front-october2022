import Link from "next/link";
import cx from "classnames";
import styles from "@styles/core/header.module.scss";
import { TiArrowSortedDown } from "react-icons/ti";

interface Page {
  url: string;
  name: string;
}

interface Props {
  pages: Array<Page>;
}

const PageStatus = ({ pages }: Props) => {
  return (
    <div className={cx(styles.pageStatusBar)}>
      {pages.map((page, index) => {
        return (
          <div key={index} style={{ display: "flex", flexDirection: "row" }}>
            {index !== 0 && (
              <span className={cx(styles.spanStatusBar)}>{">"}</span>
            )}
            <Link href={`${page.url}`}>
              <div className={cx(styles.linkStatusBar)}>{page.name}</div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default PageStatus;
