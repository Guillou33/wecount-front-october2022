import usePortal from 'react-useportal'
import cx from 'classnames';
import { useEffect, useState } from 'react';
import { motion, useAnimation } from "framer-motion";
import styles from '@styles/helpers/modal/bottomModal.module.scss';

const SCREEN_HEIGHT = typeof window === 'undefined' ? 700 : window.innerHeight;
const animations = {
  hidden: { 
    y: SCREEN_HEIGHT,
  },
  visible: {
    y: 0,
  },
};

interface Props {
  children?: any;
  open: boolean;
  onClose?: Function;
  renderCloseButton?: (onClick: Function) => JSX.Element;
};

const BottomModal = ({
  open,
  children,
  onClose,
  renderCloseButton,
}: Props) => {
  const { Portal } = usePortal()
  const controls = useAnimation();
  const [display, setDisplay] = useState("none");
  const [isOpened, setIsOpened] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // To prevent different behavior between server and browser (happening with Portal and SCREEN_HEIGHT)
  useEffect(() => {
    setIsMounted(true);
  }, [])

  const openModal = () => {
    setDisplay("block");
    controls.start(animations.visible);
    setIsOpened(true);
  }

  const closeModal = () => {
    controls.start(animations.hidden).then(() => {
      setDisplay("none");
    });
    setIsOpened(false);
  }

  const closeModalFromButton = () => {
    closeModal();
    if (onClose) {
      onClose();
    }
  }

  useEffect(() => {
    if (open && !isOpened) {
      openModal();
    } else if (!open && isOpened) {
      closeModal();
    }
  }, [open])

  const renderLocalClose = () => {
    if (renderCloseButton) {
      return renderCloseButton(closeModalFromButton);
    }
    return <i onClick={closeModalFromButton} className={cx('fas fa-times', styles.closeButton)}></i>;
  }
 
  if (!isMounted) return null;
  return (
    <Portal>
      <motion.div
        style={{display}}
        initial={animations.hidden}
        animate={controls}
        transition={{duration: 0.2}}
        className={cx(styles.main)}
      >
        <div className={cx(styles.contentContainer)}>
          {children}
        </div>
        {renderLocalClose()}
      </motion.div>
    </Portal>
  )
}

export default BottomModal;