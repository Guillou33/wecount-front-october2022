import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import { upperFirst } from "lodash";
import useTranslate from "@hooks/core/translation/useTranslate";
import ComputeMethodField from "./computeMethod/ComputeMethodField";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import { sendHelpInfo } from "@actions/analytics/analyticsActions";
import { analyticEvents, EventType, HelpEventType } from "@custom-types/core/AnalyticEvents";

const Help = () => {
  const t = useTranslate();
  const dispatch = useDispatch();
  const campaignId = useSelector<RootState, number>(
    (state) => state.campaign.currentCampaign!
  );
  const activityModelId = useSelector<RootState, number>(
    (state) => state.emissionFactorChoice.currentActivityModelId!
  );
  const activityModelInfo = useActivityModelInfo();
  const activityModel = activityModelId ? activityModelInfo[activityModelId] : undefined;
  
  return (
    <>
      {activityModel?.helpIframe && (
        <>
          <div className={styles.helpContainer}>
            <i
              className={cx("far fa-question-circle", styles.helpIcon)}
            ></i>
            <span className={styles.helpText}>
              {upperFirst(t("help.fillData"))} ?
            </span>
            <a
              href={activityModel.helpIframe}
              target="_blank"
              className={styles.helpLink}
              onClick={() => dispatch(sendHelpInfo({ eventName: analyticEvents[EventType.HELP][HelpEventType.ENTRY], campaignId }))}
            >
              {t("global.see")}
            </a>
          </div>
        </>
      )}
    </>
  );
};

export default Help;
