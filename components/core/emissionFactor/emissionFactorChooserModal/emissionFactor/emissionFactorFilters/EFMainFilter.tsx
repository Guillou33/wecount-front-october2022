import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import Checkbox from "@components/helpers/ui/Checkbox";
import { useState } from "react";

interface Props {
  active: boolean;
  text: string;
  onChange: () => void;
}

const EFMainFilter = ({ text, active, onChange }: Props) => {
  const [clickDisabled, setClickDisabled] = useState(false);
  const setClickDisabledFor100ms = () => {
    setClickDisabled(true);
    setTimeout(() => {
      setClickDisabled(false);
    }, 100);
  };

  const renderedCheckBox = (
    <div className={cx(styles.checkboxContainer)}>
      <Checkbox
        labelClassName={cx(styles.checkbox)}
        checked={active}
        onChange={(e) => {
          e.stopPropagation();
        }}
        id={`${text}-checkbox`}
      />
    </div>
  );
  return (
    <div
      onClick={() => {
        if (clickDisabled) return;
        setClickDisabledFor100ms();
        onChange();
      }}
      className={cx(styles.efMainFilter)}
    >
      {renderedCheckBox}
      <p className={cx(styles.innerText, { [styles.isChecked]: active })}>
        {text}
      </p>
    </div>
  );
};

export default EFMainFilter;
