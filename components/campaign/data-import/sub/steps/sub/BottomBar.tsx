import { t } from "i18next";
import { upperFirst } from "lodash";
import styles from "@styles/campaign/data-import/sub/steps/sub/bottomBar.module.scss";

interface Props {
  isNextStepEnabled: boolean;
  nextStepLabel?: string;
  onPreviousStepClick: () => void;
  onCancelClick: () => void;
  onNextStepClick: () => void;
}

const BottomBar = ({
  nextStepLabel = upperFirst(t("dataImport.common.next")),
  isNextStepEnabled,
  onCancelClick,
  onNextStepClick,
  onPreviousStepClick,
}: Props) => {
  return (
    <div className={styles.bottomBar}>
      <div>
        <button className="button-2" onClick={onPreviousStepClick}>
          {upperFirst(t("dataImport.common.previous"))}
        </button>
        <button className={styles.exit} onClick={onCancelClick}>
        {upperFirst(t("dataImport.common.cancel"))}
        </button>
      </div>
      <div>
        <button
          className="button-2"
          disabled={!isNextStepEnabled}
          onClick={onNextStepClick}
        >
          {nextStepLabel}
        </button>
      </div>
    </div>
  );
};

export default BottomBar;
