import cx from "classnames";

import Link from "next/link";

import styles from "@styles/campaignReports/sub/reportLink.module.scss";
import { t } from "i18next";

interface Props {
  href: string;
  onClick?: () => void;
  children?: string;
  className?: string;
}

const ReportLink = ({ href, onClick, children = `${t("global.see")} +`, className }: Props) => {
  return (
    <Link href={href}>
      <a
        onClick={() => onClick && onClick()}
        className={cx("button-1", styles.reportLink, className)}
      >
        {children}
      </a>
    </Link>
  );
};

export default ReportLink;
