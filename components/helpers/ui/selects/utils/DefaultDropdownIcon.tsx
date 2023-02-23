import { motion } from "framer-motion";
import cx from "classnames";

import { dropdownIconVariants } from "./variants";

import styles from "@styles/helpers/ui/selects/selectionContainer.module.scss";

const DefaultDropdownIcon = ({ opened }: { opened: boolean }) => (
  <motion.i
    className={cx("fas fa-caret-down", styles.dropdownIcon, {
      [styles.opened]: opened,
    })}
    variants={dropdownIconVariants}
    initial="down"
    animate={opened ? "up" : "down"}
    transition={{ duration: 0.2, type: "tween" }}
  />
);

export default DefaultDropdownIcon