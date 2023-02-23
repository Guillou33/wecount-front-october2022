import { useState, Children, isValidElement } from "react";
import cx from "classnames";
import { motion, AnimatePresence } from "framer-motion";

import { useClickOutside } from "@hooks/utils/useClickOutside";

import { OptionProps, isOption } from "./Option";
import { SelectionContainerContext } from "./selectionContainers/DefaultContainer";
import DefaultContainer from "./selectionContainers/DefaultContainer";
import { optionContainerVariants } from "./utils/variants";

import styles from "@styles/helpers/ui/selects/multiSelect.module.scss";

export type Index = string | number;

export interface SelectContext<T extends Index> {
  onClick: (value: T) => void;
  selected: T[];
}

export interface MultiSelectProps<T extends Index> {
  selected: T[];
  alignment?: "center" | "left" | "right";
  className?: string;
  selectionContainerClassName?: string;
  optionContainerClassName?: string;
  placeholder?: string | JSX.Element;
  onOptionClick: (value: T) => void;
  renderSelectionContainer?: (
    context: SelectionContainerContext
  ) => React.ReactNode;
  closeOnOptionClick?: boolean;
  children: (context: SelectContext<T>) => React.ReactElement;
  disabled?: boolean;
}

const MultiSelect = <T extends Index>({
  selected,
  onOptionClick,
  closeOnOptionClick = false,
  alignment = "left",
  placeholder,
  className,
  selectionContainerClassName,
  optionContainerClassName,
  renderSelectionContainer = ctx => <DefaultContainer {...ctx} />,
  children,
  disabled = false,
}: MultiSelectProps<T>) => {
  const [opened, setOpened] = useState(false);
  const [ref] = useClickOutside(() => {
    opened && setOpened(false);
  });

  const onClick = (value: T) => {
    setOpened(!closeOnOptionClick);
    onOptionClick(value);
  };

  const renderedChildren = children({ onClick, selected });
  const selectedChildren = Children.toArray(renderedChildren.props.children)
    .filter((element): element is React.ReactElement<OptionProps<T>> => {
      return (
        isValidElement(element) &&
        isOption<T>(element) &&
        selected.includes(element.props.value)
      );
    })
    .map(element => {
      return element.props.children;
    });
  return (
    <div ref={ref} className={cx(styles.select, className)}>
      {renderSelectionContainer({
        opened,
        setOpened,
        placeholder,
        children: selectedChildren,
        className: selectionContainerClassName,
        disabled,
      })}
      <AnimatePresence>
        {opened && (
          <motion.div
            variants={optionContainerVariants}
            animate="opened"
            initial="initial"
            exit="closed"
            custom={alignment === "center"}
            transition={{
              duration: 0.3,
              type: "tween",
            }}
            className={cx(
              styles.optionContainer,
              styles[alignment],
              optionContainerClassName
            )}
          >
            {renderedChildren}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiSelect;
