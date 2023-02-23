import { useState } from "react";
import cx from "classnames";
import { motion, AnimatePresence } from "framer-motion";

import { useClickOutside } from "@hooks/utils/useClickOutside";
import { dropDownVariants } from "./variants";
import { DropdownItem, DropdownLink, DropdownButton } from "./DropdownItem";

import styles from "@styles/helpers/ui/dropdown/dropdown.module.scss";

interface Props {
  alignment?: "left" | "center" | "right";
  togglerContent: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  togglerClassName?: string;
  itemContainerClassName?: string;
  disabled?: boolean;
  closeOnClickInside?: boolean;
}

interface UncontrolledProps {
  opened: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const DropdownUncontrolled = ({
  opened,
  onOpen,
  onClose,
  closeOnClickInside = true,
  alignment = "left",
  children,
  togglerContent,
  className,
  togglerClassName,
  itemContainerClassName,
  disabled = false,
}: Props & UncontrolledProps) => {
  const [ref] = useClickOutside(() => onClose());
  return (
    <div ref={ref} className={cx(styles.dropdown, className)}>
      <button
        className={cx(styles.toggler, togglerClassName)}
        onClick={() => onOpen()}
        disabled={disabled}
      >
        {togglerContent}
      </button>
      <AnimatePresence>
        {opened && (
          <motion.div
            variants={dropDownVariants}
            animate="opened"
            initial="initial"
            exit="closed"
            custom={alignment === "center"}
            transition={{
              duration: 0.3,
              type: "tween",
            }}
            className={cx(
              styles.itemContainer,
              itemContainerClassName,
              styles[alignment]
            )}
            onClick={() => closeOnClickInside && onClose()}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Dropdown = ({ closeOnClickInside = true, ...props }: Props) => {
  const [opened, setOpened] = useState(false);

  return (
    <DropdownUncontrolled
      opened={opened}
      onClose={() => setOpened(false)}
      onOpen={() => setOpened(true)}
      closeOnClickInside={closeOnClickInside}
      {...props}
    />
  );
};

Dropdown.Item = DropdownItem;
Dropdown.Link = DropdownLink;
Dropdown.Button = DropdownButton;

export default Dropdown;
export { DropdownUncontrolled };
