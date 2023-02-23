import cx from "classnames";

import styles from "@styles/campaign/detail/activity/sub/activity-entries/inputInstruction.module.scss";
import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  instruction: string | null;
  onEditInstructionRequested: () => void;
  isEditionAllowed: boolean;
}

const InputInstruction = ({
  instruction,
  onEditInstructionRequested,
  isEditionAllowed,
}: Props) => {

  function getInstructionText() {
    if (isEditionAllowed && !instruction) {
      return upperFirst(t("entry.instruction.add"));
    }
    if (!instruction) {
      return upperFirst(t("entry.instruction.empty"));
    }
    return instruction;
  }

  return (
    <div className={styles.inputInstructions}>
      <button
        className={cx("button-bare", styles.instructionButton, {
          [styles.hasInstruction]: instruction != null,
          [styles.isEditable]: isEditionAllowed,
        })}
        onClick={() => {
          isEditionAllowed && onEditInstructionRequested();
        }}
      >
        <img
          data-cancel-click
          src="/icons/modale/icon-comment.svg"
          alt={t("entry.comment.comment.plural")}
        />
      </button>
      {getInstructionText()}
    </div>
  );
};

export default InputInstruction;
