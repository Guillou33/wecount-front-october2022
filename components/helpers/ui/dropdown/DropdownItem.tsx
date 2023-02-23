import { forwardRef } from "react";
import cx from "classnames";

import styles from "@styles/helpers/ui/dropdown/dropdown.module.scss";

const DropdownItem = ({
  className,
  ...props
}: JSX.IntrinsicElements["div"]) => {
  return <div {...props} className={cx(styles.item, className)} />;
};

const DropdownLink = ({ className, ...props }: JSX.IntrinsicElements["a"]) => {
  return <a {...props} className={cx(styles.item, className)} />;
};

const DropdownButton = forwardRef<
  HTMLButtonElement,
  JSX.IntrinsicElements["button"] & { showAsDisabled?: boolean }
>(({ className, showAsDisabled = false, ...props }, ref) => {
  return (
    <button
      ref={ref}
      {...props}
      className={cx(styles.item, className, {
        [styles.disabled]: props.disabled || showAsDisabled,
      })}
    />
  );
});

export { DropdownItem, DropdownLink, DropdownButton };
