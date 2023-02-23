import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";
import { RootState } from "@reducers/index";
import { getTotalResultTco2 } from "@lib/core/campaign/getTotals";
import { CampaignInformation } from "@reducers/campaignReducer";
import DashboardView from "@components/dashboard/campaign/dashboardViews/DashboardView";
import MainModal from "@components/helpers/modal/MainModal";
import EditActivity from "@components/campaign/detail/activity/EditActivity";
import { ActivityEditState } from "@reducers/activity/editReducer";
import { DashboardView as View } from "@reducers/dashboards/dashboardsReducer";
import { closeModaleAndTimeoutEndEdit } from "@actions/activity/edit/editActions";
import { getTotalResultTco2ForTrajectory } from "@lib/core/campaign/getTotalsForTrajectory";

interface Props {
  campaignId: number;
}

const CampaignDashboard = ({ campaignId }: Props) => {

  const dispatch = useDispatch();
  const activityEdit = useSelector<RootState, ActivityEditState>(
    state => state.activity.edit
  );

  const campaignInformation = useSelector<
    RootState,
    CampaignInformation | undefined
  >(state => state.campaign.campaigns[campaignId]?.information);

  const resultTco2Total = !campaignInformation
    ? 0
    : getTotalResultTco2(campaignInformation);

  const currentView = useSelector<RootState, View>(
    state => state.dashboards.currentView
  );

  return (
    <div className={cx(styles.main)}>
      <DashboardView
        currentView={currentView}
        campaignId={campaignId}
        resultTco2Total={resultTco2Total}
      />
      <MainModal
        onClose={() => dispatch(closeModaleAndTimeoutEndEdit())}
        open={activityEdit.isEditing && activityEdit.isModalOpened}
      >
        <EditActivity />
      </MainModal>
    </div>
  );
};

export default CampaignDashboard;
