import cx from "classnames";
import { uniqueId } from "lodash";
import { useRef } from "react";

import Checkbox from "./Checkbox";

import styles from "@styles/helpers/ui/checkboxInput.module.scss";

interface Props {
  id: string;
  checked: boolean;
  partiallyChecked?: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  labelClassName?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const CheckboxInput = ({
  id,
  checked,
  partiallyChecked,
  onChange,
  className,
  labelClassName,
  children,
  disabled=false,
}: Props) => {
  return (
    <div className={cx(styles.checkboxInput, className)}>
      <Checkbox
        id={id}
        checked={checked}
        partiallyChecked={partiallyChecked !== undefined ? partiallyChecked : false}
        onChange={e => !disabled && onChange(e.target.checked)}
      />
      <label
        htmlFor={id}
        className={cx(styles.label, labelClassName, {
          [styles.checked]: checked,
          [styles.disabled]: disabled,
        })}
      >
        {children}
      </label>
    </div>
  );
};

export default CheckboxInput;
