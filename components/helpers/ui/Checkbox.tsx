import { ChangeEvent } from "react";
import cx from "classnames";
import { motion, AnimatePresence } from "framer-motion";
import styles from "@styles/helpers/ui/checkbox.module.scss";

interface Props {
  checked: boolean;
  partiallyChecked?: boolean;
  id: string;
  name?: string;
  className?: string;
  labelClassName?: string;
  checkedClassName?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Checkbox = ({
  name,
  id,
  checked,
  partiallyChecked,
  onChange,
  className,
  labelClassName,
  checkedClassName = styles.default,
}: Props) => {
  return (
    <div className={cx(styles.checkbox, className)}>
      <input
        className={styles.input}
        type="checkbox"
        name={name}
        id={id}
        checked={checked}
        onChange={onChange}
      />
      <label className={cx(styles.box, labelClassName)} htmlFor={id}>
        <AnimatePresence>
          {checked && (
            <motion.span
              className={cx(styles.tick, { [checkedClassName]: checked })}
              initial={{ scale: 0 }}
              animate={{ scale: 1.4 }}
              exit={{
                scale: 0,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              <i className="fa fa-check"></i>
            </motion.span>
          )}
          {partiallyChecked && (
            <motion.span
              className={cx(styles.tick, {
                [styles.partially]: partiallyChecked,
              })}
              initial={{ scale: 0 }}
              animate={{ scale: 2.4 }}
              exit={{
                scale: 0,
                transition: {
                  duration: 0.2,
                },
              }}
            >
              <i className="fa fa-minus-square"></i>
            </motion.span>
          )}
        </AnimatePresence>
      </label>
    </div>
  );
};

export default Checkbox;
