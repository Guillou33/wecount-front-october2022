import cx from "classnames";
import styles from "@styles/campaign/detail/activity/sub/activity-entries/editEntry.module.scss";
import { EntryData } from "@reducers/entries/campaignEntriesReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import {
  ComputeMethodMapping,
} from "@reducers/core/emissionFactorReducer";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import DangerConfirmModal from "@components/helpers/modal/DangerConfirmModal";
import { useState } from "react";
import { useIsEntryLockedByHistory } from "../hooks/useIsEntryLockedByHistory";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { initEFChooser } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";

interface Props {
  entry: EntryData;
  entryKey: string;
  activityModelId: number | undefined;
  campaignId: number;
}

const ActivityEntryComputeMethod = ({
  entry,
  entryKey,
  activityModelId,
  campaignId
}: Props) => {
  const dispatch = useDispatch();
  const computeMethods = useSelector<
    RootState,
    ComputeMethodMapping | undefined
  >(state =>
    activityModelId == null
      ? undefined
      : state.core.emissionFactor.mapping[activityModelId]
  );

  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);
  const campaignStatus = useSelector<RootState, CampaignStatus>(
    state => state.campaign.campaigns[campaignId]!.information!.status
  );
  const campaignClosed = [CampaignStatus.IN_PREPARATION, CampaignStatus.IN_PROGRESS].indexOf(campaignStatus) === -1;

  const computeMethod = entry.computeMethodId
    ? computeMethods?.[entry.computeMethodId] ?? null
    : null;
  const computeMethodType = entry.computeMethodType;
  const isEntryLockedByHistory = useIsEntryLockedByHistory({
    campaignId,
    entry,
  });

  const [modalForbiddenToModifyMessage, setModalForbiddenToModifyMessage] = useState<string | undefined>(undefined);

  let computeMethodName: string;
  if (computeMethod) {
    computeMethodName = computeMethod.name;
  } else {
    switch (computeMethodType) {
      case ComputeMethodType.CUSTOM_EMISSION_FACTOR:
        computeMethodName = upperFirst(t("entry.computeMethod.cef"));
        break;
      // For old custom emission factor entries
      case ComputeMethodType.DEPRECATED_EMISSION_FACTOR:
        computeMethodName = upperFirst(t("entry.computeMethod.createEmissionFactor"));
        break;
      default:
        computeMethodName = upperFirst(t("entry.computeMethod.insertRawData"))
        break;
    }
  }

  const disabled = isEntryLockedByHistory || campaignClosed || !isManager;

  return (
    <>
      <div className={cx(styles.computationModeSelectorContainer, {[styles.disabled]: disabled})}>
        <div onClick={() => {
          if (isEntryLockedByHistory) {
            setModalForbiddenToModifyMessage(`${upperFirst(t("entry.history.data.nonModifiable"))} - ${upperFirst(t("entry.history.data.createNewData"))}`)
          }
          if (!disabled) {
            dispatch(initEFChooser(entryKey));
          }
        }}>
          <p className={cx(styles.title)}>
            {upperFirst(t("entry.computeMethod.computeMethod"))} :
          </p>
          <p>
            {computeMethodName}
          </p>
        </div>
      </div>
      <DangerConfirmModal
        question={`${upperFirst(t("entry.history.data.nonModifiable"))} - ${upperFirst(t("entry.history.data.createNewData"))}`}
        btnText="OK"
        onConfirm={() => setModalForbiddenToModifyMessage(undefined)}
        small
        onClose={() => setModalForbiddenToModifyMessage(undefined)}
        open={!!modalForbiddenToModifyMessage}
        spinnerOn={false}
      ></DangerConfirmModal>
    </>
  );
};

export default ActivityEntryComputeMethod;
