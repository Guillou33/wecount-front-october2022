import { isValidElement } from "react";
import cx from "classnames";
import { Index, SelectContext } from "./MultiSelect";

import styles from "@styles/helpers/ui/selects/option.module.scss";

function isReactNode(obj: any): obj is React.ReactNode {
  return (
    isValidElement(obj) ||
    typeof obj === "string" ||
    typeof obj === "number" ||
    typeof obj === "boolean" ||
    typeof obj === "object"
  );
}

export function isOption<T extends Index>(
  element: React.ReactElement
): element is React.ReactElement<OptionProps<T>> {
  const valueIsValid =
    typeof element.props.value === "string" ||
    typeof element.props.value === "number" ||
    typeof element.props.value === "symbol";

  return valueIsValid && isReactNode(element.props.children);
}

export interface OptionProps<T extends Index> extends SelectContext<T> {
  value: T;
  disabled?: boolean;
  children: React.ReactNode;
  className?: string;
  isSelected?: boolean;
}

const Option = <T extends Index>({
  value,
  children,
  disabled = false,
  onClick,
  selected,
  className,
  isSelected = selected.includes(value),
}: OptionProps<T>) => {
  return (
    <div
      className={cx(styles.option, className, {
        [styles.selected]: isSelected,
        [styles.disabled]: disabled,
      })}
      onClick={() => !disabled && onClick(value)}
    >
      {children}
    </div>
  );
};

export default Option;
