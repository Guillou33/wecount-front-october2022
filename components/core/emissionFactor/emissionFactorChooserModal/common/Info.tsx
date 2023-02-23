import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactor/emissionFactorList/emissionFactorItem.module.scss";

interface Props {
  label: string;
  iconPath: string;
  content: string;
}

const Info = ({
  label,
  iconPath,
  content,
}: Props) => {
  return (
    <div className={cx(styles.infoContainer)}>
      <div className={cx(styles.firstLine)}>
        <img
          className={styles.picto}
          src={iconPath}
        />
        <p className={styles.label}>{label}</p>
      </div>
      <div className={cx(styles.secondLine)}>
        <p>{content}</p>
      </div>
    </div>
  );
}

export default Info;
