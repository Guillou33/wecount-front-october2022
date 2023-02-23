import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import { RootState } from "@reducers/index";
import { Campaign as CampaignType, UnitModes } from "@reducers/campaignReducer";
import { changeCampaignUnitMode } from "@actions/campaign/campaignActions";
import styles from "@styles/campaign/detail/sub/switchUnitMode.module.scss";
import { motion, AnimateSharedLayout } from "framer-motion";

interface Props {
  campaignId: number;
}

const SwitchUnitMode = ({ campaignId }: Props) => {
  const dispatch = useDispatch();
  const campaign = useSelector<RootState, CampaignType | undefined>(
    state => state.campaign.campaigns[campaignId]
  );
  const isPercentMode = campaign?.unitMode === UnitModes.PERCENT;

  const setUnitMode = (mode: UnitModes) =>
    dispatch(changeCampaignUnitMode(campaignId, mode));

  return (
    <div className={cx(styles.switchUnitContainer)}>
      <AnimateSharedLayout>
        <button
          className={cx(styles.unit, { [styles.active]: isPercentMode })}
          onClick={() => setUnitMode(UnitModes.PERCENT)}
        >
          {isPercentMode && (
            <motion.div
              layoutId="mark"
              className={styles.activeMark}
            ></motion.div>
          )}
          <span className={styles.text}>%</span>
        </button>
        <button
          className={cx(styles.unit, { [styles.active]: !isPercentMode })}
          onClick={() => setUnitMode(UnitModes.RAW)}
        >
          {!isPercentMode && (
            <motion.div
              layoutId="mark"
              className={styles.activeMark}
            ></motion.div>
          )}
          <span className={styles.text}>
            CO<span className={styles.small}>2</span>
          </span>
        </button>
      </AnimateSharedLayout>
    </div>
  );
};

export default SwitchUnitMode;
