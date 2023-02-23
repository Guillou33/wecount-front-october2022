import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import Help from "./Help";

interface Props {
  onClose: () => void;
}

const Header = ({
  onClose,
}: Props) => {
  return (
    <div className={cx(styles.header)}>
      <button onClick={onClose} className={cx(styles.closeButton)}>
        <i className="fa fa-times"></i>
      </button>
      <Help />
    </div>
  );
};

export default Header;