import { useRef } from "react";
import { motion } from "framer-motion";
import cx from "classnames";
import throttle from "lodash/throttle";

import styles from "@styles/campaign/data-import/sub/steps/sub/paginationScroller.module.scss";

interface Props {
  totalLength: number;
  scrollerLength: number;
  scrollOffset: number;
  onScollChange: (scrollOffset: number) => void;
  onPreviousClick: () => void;
  onNextClick: () => void;
}

const PaginationScroller = ({
  totalLength,
  scrollerLength,
  scrollOffset,
  onScollChange,
  onPreviousClick,
  onNextClick,
}: Props) => {
  const gutterRef = useRef<HTMLDivElement | null>(null);
  const scrollerRef = useRef<HTMLDivElement | null>(null);

  if (scrollerLength >= totalLength) {
    return null;
  }

  return (
    <div className={styles.paginationScroller}>
      <button
        className={cx("button-bare", styles.paginationButton)}
        onClick={onPreviousClick}
      >
        <i className="fa fa-caret-left"></i>
      </button>
      <div
        className={styles.gutter}
        ref={gutterRef}
        style={{
          gridTemplateColumns: `repeat(${totalLength}, 1fr)`,
        }}
      >
        <motion.div
          ref={scrollerRef}
          className={styles.scroller}
          style={{
            gridColumnStart: scrollOffset + 1,
            gridColumnEnd: scrollOffset + scrollerLength + 1,
          }}
          drag="x"
          dragConstraints={gutterRef}
          dragElastic={false}
          dragMomentum={false}
          layout="position"
          onDrag={throttle(() => {
            if (scrollerRef.current != null && gutterRef.current != null) {
              const { width: gutterWidth, x: gutterX } =
                gutterRef.current.getBoundingClientRect();
              const { x } = scrollerRef.current.getBoundingClientRect();

              const scrollerXOffset = x - gutterX;
              const pageLength = (gutterWidth - 1) / totalLength;
              const page = Math.floor(scrollerXOffset / pageLength);

              if (page !== scrollOffset) {
                onScollChange(page);
              }
            }
          }, 16)}
        ></motion.div>
      </div>
      <button
        className={cx("button-bare", styles.paginationButton)}
        onClick={onNextClick}
      >
        <i className="fa fa-caret-right"></i>
      </button>
    </div>
  );
};

export default PaginationScroller;
