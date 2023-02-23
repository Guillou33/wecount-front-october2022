import StatusBadge from "@components/core/StatusBadge";
import _ from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { Activity as ActivityType, UnitModes } from "@reducers/campaignReducer";
import cx from "classnames";
import styles from "@styles/campaign/detail/dashboard/activity.module.scss";
import { useDispatch } from "react-redux";
import { startEdit } from "@actions/activity/edit/editActions";
import CounterBadge from "@components/core/CounterBadge";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";

interface Props {
  id: number;
}

const Activity = ({ id }: Props) => {
  const dispatch = useDispatch();
  const campaignId = useSelector<RootState, number>(
    state => state.campaign.currentCampaign!
  );
  const activity = useSelector<RootState, ActivityType>(
    state => state.campaign.campaigns[campaignId].activities![id]
  );
  const activityModels = useActivityModelInfo();

  const entryInfoTotal = useAllEntriesInfoTotal(campaignId);
  const unitMode = useSelector<RootState, UnitModes>(
    state => state.campaign.campaigns[campaignId]?.unitMode ?? UnitModes.RAW
  );

  const getActivityName = () => {
    if (activity?.title) {
      return activity?.title;
    }
    return `${activityModels[activity.activityModelId].category.name} - ${
      activityModels[activity.activityModelId].name
    }`;
  };

  return (
    <div
      onClick={() =>
        dispatch(
          startEdit({
            activityModelId: activity.activityModelId,
          })
        )
      }
      className={styles.activity}
    >
      <div className={styles.leftPart}>
        <div className={styles.activityNameContainer}>
          <p className={styles.activityName}>{getActivityName()}</p>
          <i className={cx("fas fa-pen", styles.iconModify)}></i>
        </div>
        <div className={cx(styles.bottomInfo)}>
          <StatusBadge className={styles.status} status={activity.status} />
          {activity.resultTco2 ? (
            <CounterBadge
              className={styles.counterBadge}
              value={activity.resultTco2}
              lightMode={true}
              type={unitMode === UnitModes.PERCENT ? "percent" : "raw"}
              totalValue={entryInfoTotal.tCo2}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Activity;
