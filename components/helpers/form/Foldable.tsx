import { motion, TargetAndTransition } from "framer-motion";

interface Props {
  isOpen: boolean;
  onCloseComplete?: () => void;
  transition?: { [key: string]: any };
  children: JSX.Element;
}

const opened: TargetAndTransition = {
  height: "auto",
  transitionEnd: {
    overflow: "visible",
  },
};
const folded: TargetAndTransition = {
  height: "0",
  overflow: "hidden",
};

const Foldable = ({
  isOpen,
  transition = { duration: 0.3, ease: "easeInOut" },
  onCloseComplete,
  children,
}: Props) => {
  return (
    <motion.div
      initial={false}
      animate={isOpen ? opened : folded}
      transition={transition}
      onAnimationComplete={() =>
        onCloseComplete && !isOpen && onCloseComplete()
      }
    >
      {children}
    </motion.div>
  );
};

export default Foldable;
