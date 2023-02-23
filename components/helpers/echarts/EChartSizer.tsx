import cx from "classnames";
import styles from "@styles/helpers/echarts/echartSizer.module.scss";

interface Props {
  numberOfElement: number;
  elementHeight?: number;
  className?: string;
  children: React.ReactNode;
}

const EChartSizer = ({
  numberOfElement,
  elementHeight = 45,
  className,
  children,
}: Props) => {
  return (
    <div
      className={cx(styles.echartSizer, className)}
      style={{ height: `${numberOfElement * elementHeight}px` }}
    >
      {children}
    </div>
  );
};

export default EChartSizer;
