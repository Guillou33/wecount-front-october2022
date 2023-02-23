import { ReactNode } from "react";
import ClassicModal, { Props as ClassicModalProps } from "./ClassicModal";
import styles from "@styles/helpers/modal/dangerConfirmModal.module.scss";
import cx from "classnames";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";

interface Props extends ClassicModalProps {
  question: ReactNode;
  btnText: string;
  onConfirm: () => void;
  spinnerOn?: boolean;
  btnDanger?: boolean;
}

const DangerConfirmModal = ({ btnDanger = true, ...props }: Props) => {
  let propsClassicModal = { ...props };
  delete propsClassicModal.children;
  return (
    <ClassicModal {...props}>
      <div className={cx(styles.main)}>
        {typeof props.question === "string" ? (
          <p className={cx("color-1")}>{props.question}</p>
        ) : (
          props.question
        )}

        <ButtonSpinner
          spinnerOn={props.spinnerOn ?? false}
          onClick={props.onConfirm}
          className={cx(
            { ["button-danger"]: btnDanger, ["button-1"]: !btnDanger },
            styles.btnConfirm
          )}
        >
          {props.btnText}
        </ButtonSpinner>
      </div>
    </ClassicModal>
  );
};

export default DangerConfirmModal;
