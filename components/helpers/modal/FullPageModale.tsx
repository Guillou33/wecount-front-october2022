import { useRef } from "react";
import usePortal from "react-useportal";
import cx from "classnames";
import { ModalContextProvider } from "@hooks/core/modals/useModalContainerRef";
import styles from "@styles/helpers/modal/fullPageModale.module.scss";
interface Props {
  children?: any;
  open: boolean;
  onClose: () => void;
}

const MainModal = ({ open, children, onClose }: Props) => {
  const { Portal } = usePortal();
  const ref = useRef<HTMLDivElement>(null);
  if (!open) return null;
  return (
    <Portal>
      <div
        className={cx(styles.main)}
        onClick={e => e.target === e.currentTarget && onClose()}
      >
        <div className={cx(styles.content)} ref={ref}>
          <ModalContextProvider containerRef={ref}>{children}</ModalContextProvider>
        </div>
      </div>
    </Portal>
  );
};

export default MainModal;
