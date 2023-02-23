import Tooltip from "@components/helpers/bootstrap/Tooltip";
import cx from "classnames";
import styles from "@styles/filters/activeFilterBadge.module.scss";

interface Props {
  onRemoveClick: () => void;
  children: string | JSX.Element;
  className?: string;
}

const ActiveFilterBadge = ({ onRemoveClick, children, className }: Props) => {
  return (
    <div className={cx(styles.activeFilterBadge, className)}>
      <div className={styles.label}>
        <Tooltip content={children} hideDelay={0} showDelay={0} placement="bottom">
          <div className={styles.labelWrapper}>{children}</div>
        </Tooltip>
      </div>
      <button className={styles.removeButton} onClick={onRemoveClick}>
        <i className="fa fa-times"></i>
      </button>
    </div>
  );
};

export default ActiveFilterBadge;
