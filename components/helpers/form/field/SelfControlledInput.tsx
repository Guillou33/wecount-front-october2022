import { useState, useEffect } from "react";
import styles from "@styles/helpers/form/field/selfControlledInput.module.scss";
import cx from "classnames";

const SelfControlledInput = (props: {
  [key: string]: any;
  onHtmlChange?: (value: string) => void;
  onLocalChange?: (value: string) => void;
  refreshOnBlur?: boolean;
  value?: any;
  validateChange?: (value: string) => boolean;
  rightIconClassName?: any;
}) => {
  const validateChange = props.validateChange ?? (() => true);
  const [currentValue, setCurrentValue] = useState(props.value);
  useEffect(() => {
    setCurrentValue(props.value);
  }, [props.value])

  const passedProps: { [key: string]: any } = { ...props };
  const value = props.value ?? "";
  const refreshOnBlur = props.refreshOnBlur;
  delete passedProps.onHtmlChange;
  delete passedProps.value;
  delete passedProps.refreshOnBlur;
  delete passedProps.validateChange;

  const onBlur = () => {
    props.onHtmlChange && props.onHtmlChange(currentValue ?? "")
    refreshOnBlur && setCurrentValue(value);
  }

  return (
    <div className={cx(styles.main)}>
      <input
        className={cx(styles.mainInput)}
        value={currentValue ?? ""}
        onBlur={onBlur}
        onChange={(e: any) => {
          const validatedValue = validateChange(e.target.value) ? e.target.value : currentValue;
          setCurrentValue(validatedValue);
          if (props.onLocalChange) {
            props.onLocalChange(validatedValue ?? '');
          }
        }}
        {...passedProps}
      />
      {!!props.rightIconClassName && (
        <div className={cx(styles.rightIconContaainer)}>
          <i className={cx(styles.rightIcon, props.rightIconClassName)}></i>
        </div>
      )}
    </div>
  );
};

export default SelfControlledInput;
