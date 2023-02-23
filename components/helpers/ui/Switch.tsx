import cx from "classnames";
import styles from "@styles/helpers/ui/switch.module.scss";

interface Props {
  checked: boolean;
  onChange?: (value: boolean, name?: string) => void;
  name?: string;
  className?: string;
  activeClassName?: string;
  barClassname?: string;
  children?: string;
  labelPosition?: "left" | "right";
  size?: "normal" | "small";
}

const Switch = ({
  checked,
  onChange,
  className = "",
  name,
  activeClassName = styles.defaultSwitchedOn,
  barClassname = styles.default,
  labelPosition = "left",
  children,
  size = "normal",
}: Props) => {
  return (
    <div
      className={cx(styles.switch, className, {
        [styles.switchedOn]: checked,
        [styles.small]: size === "small",
      })}
      onClick={e => {
        e.stopPropagation();
        onChange && onChange(!checked, name);
      }}
    >
      {children && labelPosition === "left" && (
        <div className={styles.switchLabel}>{children}</div>
      )}
      <div
        className={cx(styles.bar, [barClassname], {
          [activeClassName]: checked,
        })}
      >
        <div className={cx(styles.marker)}></div>
      </div>
      {children && labelPosition === "right" && (
        <div className={styles.switchLabel}>{children}</div>
      )}
    </div>
  );
};

export default Switch;
