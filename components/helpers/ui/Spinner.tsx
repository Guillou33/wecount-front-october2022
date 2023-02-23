import cx from "classnames";

import styles from "@styles/helpers/ui/spinner.module.scss";

interface Props {
  className?: string;
  spinnerClassName?: string;
  children?: React.ReactNode;
  direction?: "vertical" | "horizontal";
}

const Spinner = ({
  className,
  spinnerClassName,
  children = "Chargement des données...",
  direction = "horizontal",
}: Props) => {
  return (
    <div
      className={cx(styles.spinnerContainer, className, {
        [styles.vertical]: direction === "vertical",
      })}
    >
      <div
        className={cx(
          "spinner-border text-secondary",
          styles.spinner,
          spinnerClassName
        )}
      ></div>
      <div>{children}</div>
    </div>
  );
};

export default Spinner;
