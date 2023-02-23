import { useRef, useState, useCallback } from "react";
import cx from "classnames";

import styles from "@styles/helpers/ui/stickyToolBar.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  anchor: string;
  title?: string;
  className?: string;
  stuckClassName?: string;
  children?: JSX.Element | string;
}

const StickyToolBar = ({
  anchor,
  title,
  className,
  stuckClassName = "",
  children,
}: Props) => {
  const [isStuck, setIsStuck] = useState(false);

  function createObserverInBrowser() {
    if (typeof window !== "undefined") {
      return new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsStuck(false);
        } else {
          setIsStuck(true);
        }
      });
    }
    return null;
  }

  const intersectionObserver = useRef(createObserverInBrowser());

  const sentinel = useCallback((node: HTMLDivElement) => {
    if (intersectionObserver.current != null) {
      if (node != null) {
        intersectionObserver.current.observe(node);
      } else {
        intersectionObserver.current.disconnect();
      }
    }
  }, []);

  return (
    <>
      <div ref={sentinel}></div>
      <div
        className={cx(styles.stickyToolBar, className, {
          [styles.stuck]: isStuck,
          [stuckClassName]: isStuck,
        })}
      >
        <i className={cx("fa fa-wrench", styles.settingsIcon)}></i>
        <div className={styles.settingsContainer}>
          {title != null && <div className={styles.title}>{title}</div>}
          {children}
        </div>
        <a
          href={`#${anchor}`}
          className={styles.backToTop}
          title={upperFirst(t("global.topPage"))}
        >
          <i className="fa fa-arrow-up"></i>
        </a>
      </div>
    </>
  );
};

export default StickyToolBar;
