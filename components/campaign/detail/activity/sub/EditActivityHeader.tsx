import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import moment from "moment";

import { RootState } from "@reducers/index";
import { Campaign as CampaignType } from "@reducers/campaignReducer";
import { PerimeterRole } from "@custom-types/wecount-api/auth";

import getEntryInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";
import { getInitialEntryInfo } from "@lib/core/activityEntries/entryInfo";

import { closeModaleAndTimeoutEndEdit } from "@actions/activity/edit/editActions";

import Tco2ResultBadge from "@components/core/Tco2ResultBadge";
import StatusProgress from "@components/core/StatusProgress";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import Tabs from "@components/helpers/ui/Tabs";

import useCampaignHasHiddenEmissions from "@hooks/core/useCampaignHasHiddenEmissions";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import { getStatusesPercentageFromStatusesCount } from "@hooks/core/helpers/statusesCount";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";

import styles from "@styles/campaign/detail/activity/sub/editActivityHeaderNew.module.scss";
import { FiCalendar } from "react-icons/fi";
import selectFilteredActivityEntriesForHeader from "@selectors/activityEntries/selectFilteredEntriesForHeader";
import useNotExcludedEntriesInfoByActivityModel from "@hooks/core/notExcludedActivityEntryInfo/useNotExcludedEntriesByActivityModel";
import { ExcludedFilter } from "@reducers/filters/filtersReducer";
import useAllEntriesInfoByActivityModel from "@hooks/core/activityEntryInfo/useAllEntriesByActivityModel";
import { upperFirst } from "lodash";
import { t } from "i18next";

export type View = "ENTRIES" | "HISTORY";

interface Props {
  currentView: View;
  setView: (view: View) => void;
  activityModelId: number;
}

const EditActivityHeader = ({
  currentView,
  setView,
  activityModelId,
}: Props) => {
  const dispatch = useDispatch();

  const campaignId = useSelector<RootState, number>(
    // Set in getInitialProps
    state => state.campaign.currentCampaign!
  );
  const campaign = useSelector<RootState, CampaignType | undefined>(
    state => state.campaign.campaigns[campaignId]
  );

  const isExcludedChecked = useSelector<RootState, ExcludedFilter>(
    state => state.filters.cartographyExcluded
  );
  const activeExcludedFilter = isExcludedChecked.excludedEntries;

  const activityModelInfo = useActivityModelInfo();
  const activityModel = activityModelInfo[activityModelId];

  const allEntries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForHeader(state, campaignId)
  );
  const entryInfoTotal =
    getEntryInfoByActivityModel(allEntries)[activityModelId] ??
    getInitialEntryInfo();

  const entryInfoForHeaderTotal =
    useAllEntriesInfoByActivityModel(campaignId)[activityModelId];
  const notExcludedEntriesInfoTotal =
    useNotExcludedEntriesInfoByActivityModel(campaignId)[activityModelId];

  const activitiesProgression = getStatusesPercentageFromStatusesCount({
    ...entryInfoTotal.nbByStatus,
    total: entryInfoTotal.nb,
  });

  const campaignHasHiddenEmissions = useCampaignHasHiddenEmissions(campaignId);

  const isCollaborator = useUserHasPerimeterRole(
    PerimeterRole.PERIMETER_COLLABORATOR
  );

  const isManager = useUserHasPerimeterRole(
    PerimeterRole.PERIMETER_MANAGER
  );

  return (
    <div className={cx(styles.header, "page-header")}>
      <div className={cx(styles.campaignInfoWrapper)}>
        <div className={cx(styles.campaignInfo)}>
          <div className={cx(styles.campaignInfoInnerLeft)}>
            <div className={styles.pageStatusBar}>
              <button
                onClick={() => {
                  dispatch(closeModaleAndTimeoutEndEdit());
                }}
                className={styles.button}
              >
                <span className={cx(styles.spanStatusBar)}>{"<"}</span>{" "}
                <span className={styles.linkStatusBar}>
                  {upperFirst(t("cartography.backToCartography"))}
                </span>
              </button>
            </div>
            <div className={cx(styles.campaignTitleInnerLeft)}>
              <h1
                className={styles.campaignTitle}
              >{`${activityModel.category.name} - ${activityModel.name}`}</h1>
            </div>
            <div className={styles.yearSelectorsContainer}>
              <div className={styles.campaignNameHeader}>
                <p>{campaign?.information?.name ?? ""}</p>
              </div>
              <div
                className={styles.selectedYearField}
                style={{ color: "#c5cae7" }}
              >
                <FiCalendar color="#c5cae7" size="12" />
                <p style={{ marginLeft: 5 }}>
                  {upperFirst(t("global.time.year"))} :
                </p>
                <span className={cx(styles.selectedYear)}>
                  {campaign?.information?.year || moment().format("YYYY")}
                </span>
              </div>
            </div>
          </div>
          <div className={cx(styles.campaignInfoInnerRight)}>
            <StatusProgress
              className={cx(styles.activitiesProgression, {
                ["mr-0"]: !isCollaborator,
              })}
              total={activitiesProgression.total}
              toValidate={activitiesProgression.TO_VALIDATE}
              validated={activitiesProgression.TERMINATED}
              inProgress={activitiesProgression.IN_PROGRESS}
              label={t("entry.entry")}
            />
            {isManager && (
              <div className={cx(styles.campaignInfoResultBadge)}>
                <Tco2ResultBadge
                  className={styles.campaignResults}
                  resultTco2={entryInfoTotal.tCo2}
                  totalResultTco2={entryInfoForHeaderTotal.tCo2}
                  notExcludedResultTco2={notExcludedEntriesInfoTotal.tCo2}
                  active={activeExcludedFilter}
                />
              </div>
            )}
          </div>
        </div>
        {campaignHasHiddenEmissions && (
          <Tooltip content={upperFirst(t("entry.emission.hiddenEmission"))}>
            <div className={cx(styles.hasHiddenEmissionsBadge)}>
              <i className="fa fa-exclamation-triangle"></i>
            </div>
          </Tooltip>
        )}
      </div>
      <div className={styles.tabsContainer}>
        <Tabs
          className={styles.tabs}
          value={currentView}
          onChange={setView}
          tabItems={[
            {
              value: "ENTRIES" as const,
              label: t("footprint.emission.emission.plural").toUpperCase(),
            },
            {
              value: "HISTORY" as const,
              label: t("entry.history.history").toUpperCase(),
            },
          ]}
        />
      </div>
    </div>
  );
};

export default EditActivityHeader;
