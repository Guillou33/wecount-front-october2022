import { motion, useAnimation } from "framer-motion";
import { useState } from "react";

interface FoldableProps {
  children: any; 
  transition?: {[key: string]: any}
}

const useFoldable = (isOpenInitialValue: boolean = false) => {
  const [overflow, setOverflow] = useState(isOpenInitialValue ? "initial" : "hidden");
  const [isOpen, setIsOpen] = useState(isOpenInitialValue);
  const controls = useAnimation();

  const foldable = (content: any, transition?: {[key: string]: any}) => {
    return (
      <motion.div
        style={{overflow}}
        initial={{ height: (isOpenInitialValue ? "auto" : 0) }}
        animate={controls}
        transition={transition ?? { duration: 0.3, ease: "easeInOut" }}
      >
        {content}
      </motion.div>
    );
  }

  const open = () => {
    controls.start({
      height: "auto",
    }).then(() => {
      setOverflow("initial");
    });
    setIsOpen(true);
  };
  
  const close = () => {
    setOverflow("hidden");
    controls.start({
      height: 0,
    });
    setIsOpen(false);
  };

  const toggle = () => {
    if (isOpen) {
      close();
    } else {
      open();
    }
  };

  return {
    isOpen,
    open,
    close,
    toggle,
    foldable,
  };
};

export default useFoldable;