import ClassicModal from "@components/helpers/modal/ClassicModal";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";

import styles from "@styles/campaign/detail/activity/sub/activity-entries/instructionModale.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  isOpened: boolean;
  instruction: string;
  onClose: () => void;
  onEditInstruction: (value: string) => void;
}

const InstructionModal = ({
  isOpened,
  instruction,
  onClose,
  onEditInstruction,
}: Props) => {
  return (
    <ClassicModal open={isOpened} small onClose={onClose}>
      <p className={styles.modalLabel}>{upperFirst(t("entry.instruction.instruction"))}</p>
      <div className={"default-field"}>
        <SelfControlledTextarea
          className={"field"}
          value={instruction}
          placeholder={upperFirst(t("entry.instruction.instruction"))}
          onHtmlChange={(value: string) => {
            onEditInstruction(value);
          }}
        />
      </div>
      <div className={styles.buttonUpdateContainer}>
        <button
          className="button-1"
          onClick={() => {
            onClose();
          }}
        >
          Ok
        </button>
      </div>
    </ClassicModal>
  );
};

export default InstructionModal;
