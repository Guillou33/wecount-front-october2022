import { useState } from "react";
import cx from "classnames";
import styles from "@styles/helpers/form/field/inputAddon.module.scss";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";

interface Props {
  [key: string]: any;
  value?: any;
  onChange?: (value: string) => void;
  className?: string;
  addonLeft?: string | JSX.Element;
  addonRight?: string | JSX.Element;
  inputClassName?: string;
  validateChange?: (value: string) => boolean;
  disabled?: boolean;
}

const InputAddon = ({
  value,
  onChange,
  className,
  inputClassName,
  addonRight,
  addonLeft,
  validateChange,
  disabled = false,
  ...inputProps
}: Props) => {
  const [focused, setFocused] = useState(false);
  return (
    <div
      className={cx(styles.inputAddon, className, {
        [styles.focused]: focused,
        [styles.empty]: value == null,
        [styles.disabled]: disabled
      })}
    >
      {addonLeft != null && addonLeft}
      <SelfControlledInput
        className={cx(styles.input, inputClassName)}
        value={value}
        onHtmlChange={value => {
          setFocused(false);
          onChange && onChange(value);
        }}
        disabled={disabled}
        {...inputProps}
        onFocus={() => setFocused(true)}
        validateChange={validateChange}
      />
      {addonRight != null && addonRight}
    </div>
  );
};

export default InputAddon;
