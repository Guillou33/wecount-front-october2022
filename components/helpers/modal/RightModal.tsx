import usePortal from "react-useportal";
import cx from "classnames";
import { motion, AnimatePresence, Variants } from "framer-motion";
import styles from "@styles/helpers/modal/rightModal.module.scss";

const modalVariants: Variants = {
  hidden: {
    opacity: 0,
    transition: {
      duration: 0.3,
    },
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};
const contentVariants = {
  hidden: {
    x: "100%",
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    x: 0,
    transition: {
      duration: 0.2,
    },
  },
};

interface Props {
  children?: any;
  open: boolean;
  onClose: () => void;
}

const RightModal = ({ open, children, onClose }: Props) => {
  const { Portal } = usePortal();

  return (
    <AnimatePresence>
      {open && (
        <Portal>
          <motion.div
            initial="hidden"
            variants={modalVariants}
            animate="visible"
            exit="hidden"
            className={cx(styles.main)}
            onClick={e => e.target === e.currentTarget && onClose()}
          >
            <motion.div
              className={cx(styles.content)}
              variants={contentVariants}
            >
              {children}
            </motion.div>
          </motion.div>
        </Portal>
      )}
    </AnimatePresence>
  );
};

export default RightModal;
