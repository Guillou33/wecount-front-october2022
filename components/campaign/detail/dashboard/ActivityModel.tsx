import React from "react";
import CounterBadge from "@components/core/CounterBadge";
import _ from "lodash";
import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@reducers/index";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import styles from "@styles/campaign/detail/dashboard/activityModel.module.scss";
import { UnitModes } from "@reducers/campaignReducer";
import { startEdit } from "@actions/activity/edit/editActions";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
import { motion } from "framer-motion";
import { FiEdit2 } from "react-icons/fi";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import selectFilteredActivityEntriesForCartography from "@selectors/activityEntries/selectFilteredActivityEntriesForCartography";
import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";
import getEntryInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";

interface Props {
  id: number;
}

const ActivityModel = ({ id }: Props) => {
  const dispatch = useDispatch();
  const withReadOnlyAccessControl = useReadOnlyAccessControl();
  const isPerimeterManager = useUserHasPerimeterRole(
    PerimeterRole.PERIMETER_MANAGER
  );

  const campaignId = useSelector<RootState, number>(
    state => state.campaign.currentCampaign!
  );

  const entryInfoTotal = useAllEntriesInfoTotal(campaignId);

  const unitMode = useSelector<RootState, UnitModes>(
    state => state.campaign.campaigns[campaignId]?.unitMode ?? UnitModes.RAW
  );

  const activityModels = useActivityModelInfo();
  const activityModel = activityModels[id];

  const filteredEntries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForCartography(state, campaignId)
  );
  const entryInfoForActivityModel =
    getEntryInfoByActivityModel(filteredEntries)[id];

  const numberOfEntriesInActivityModel = entryInfoForActivityModel?.nb ?? 0;
  const isEntryListAvailable =
    numberOfEntriesInActivityModel > 0 || isPerimeterManager;

  const onActivityModelClick = () => {
    if (isEntryListAvailable) {
      withReadOnlyAccessControl(() =>
        dispatch(
          startEdit({
            activityModelId: id,
          })
        )
      )();
    }
  };

  return (
    <div className={cx(styles.activityModelContainer)}>
      <div
        onClick={onActivityModelClick}
        className={cx(styles.activityModel, {
          [styles.noEdit]: !isEntryListAvailable,
        })}
      >
        <div className={styles.leftPart}>
          {numberOfEntriesInActivityModel > 0 && (
            <div
              className={cx(
                styles.inProgressBadge,
                styles[entryInfoForActivityModel.status]
              )}
            ></div>
          )}
          <p className={styles.activityModelName}>
            {activityModel.name.toLocaleUpperCase()}
            {!activityModel.description ? null : (
              <Tooltip placement="top" content={activityModel.description}>
                <i
                  className={cx(
                    "fas fa-info-circle",
                    styles.tooltipDescription
                  )}
                ></i>
              </Tooltip>
            )}
            {numberOfEntriesInActivityModel > 0 && (
              <span className={styles.activityNumber}>
                &nbsp;({entryInfoForActivityModel.nb})
              </span>
            )}
          </p>
        </div>
        <div className={styles.rightPart}>
          {entryInfoForActivityModel?.tCo2 !== undefined && (
            <CounterBadge
              className={styles.counterBadge}
              value={entryInfoForActivityModel.tCo2}
              lightMode={true}
              fontSize={"0.75rem"}
              type={unitMode === UnitModes.PERCENT ? "percent" : "raw"}
              totalValue={entryInfoTotal.tCo2}
            />
          )}
          <div className={cx(styles.editIcon)}>
            <motion.div
              animate={{ x: 0 }}
              transition={{ ease: "easeOut", duration: 2 }}
            >
              <FiEdit2 size="16" color="#b395e0" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityModel;
