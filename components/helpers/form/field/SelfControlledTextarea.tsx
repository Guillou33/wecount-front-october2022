import { useState, useEffect } from "react";

const SelfControlledTextarea = (props: {
  [key: string]: any;
  onHtmlChange?: (value: string) => void;
  onLocalChange?: (value: string) => void;
  refreshOnBlur?: boolean;
  value?: any;
}) => {
  const [currentValue, setCurrentValue] = useState(props.value);
  useEffect(() => {
    setCurrentValue(props.value);
  }, [props.value]);

  const passedProps: { [key: string]: any } = { ...props };
  const value = props.value ?? "";
  const refreshOnBlur = props.refreshOnBlur;
  delete passedProps.onHtmlChange;
  delete passedProps.value;
  delete passedProps.refreshOnBlur;

  const onBlur = () => {
    props.onHtmlChange && props.onHtmlChange(currentValue ?? "");
    refreshOnBlur && setCurrentValue(value);
  };

  return (
    <textarea
      value={currentValue ?? ""}
      onBlur={onBlur}
      onChange={(e: any) => {
        setCurrentValue(e.target.value);
        if (props.onLocalChange) {
          props.onLocalChange(e.target.value ?? "");
        }
      }}
      {...passedProps}
    />
  );
};

export default SelfControlledTextarea;
