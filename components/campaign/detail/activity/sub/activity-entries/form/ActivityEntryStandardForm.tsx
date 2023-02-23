import React, { useEffect, useMemo, useState } from 'react';
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { ActivityEntryReferenceHistory, EntryData } from "@reducers/entries/campaignEntriesReducer";
import styles from "@styles/campaign/detail/activity/activityEntries.module.scss";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import { parseAvoidingNaN } from "@lib/utils/calculator";
import { ComputeMethod } from "@reducers/core/emissionFactorReducer";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import EmissionFactorField from "../EmissionFactorField";

import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import useIsEntryWriter from "@hooks/core/perimeterAccessControl/useIsEntryWritter";
import { useLastActivityEntryFromHistory } from '../hooks/useLastActivityEntryFromHistory';
import { CampaignStatus } from '@custom-types/core/CampaignStatus';
import { ComputeMode } from '@custom-types/wecount-api/computeMethod';
import DangerConfirmModal from '@components/helpers/modal/DangerConfirmModal';
import { canBeCoercedToNumber } from '@lib/utils/canBeCoercedToNumber';
import { useIsEntryLockedByHistory } from '../hooks/useIsEntryLockedByHistory';
import { upperFirst } from 'lodash';
import { t } from 'i18next';
import { initEFChooser, setModalOpen } from '@actions/emissionFactorChoice/emissionFactorChoiceActions';
import { EmissionFactorModalChoice } from '@reducers/emissionFactorChoice/emissionFactorChoiceReducer';
import { ComputeMethodType } from '@custom-types/core/ComputeMethodType';

interface Props {
  entry: EntryData;
  activityModelId: number | undefined;
  save: Function;
  campaignId: number;
  entryKey: string;
}

const ActivityEntryStandardForm = ({ entry, save, activityModelId, campaignId, entryKey }: Props) => {
  const dispatch = useDispatch();
  const isCustomEF = entry.computeMethodType === ComputeMethodType.CUSTOM_EMISSION_FACTOR;

  const computeMethod = useSelector<RootState, ComputeMethod | undefined>(
    state =>
      !activityModelId || !entry.computeMethodId
        ? undefined
        : state.core.emissionFactor.mapping?.[activityModelId]?.[
        entry.computeMethodId
        ]
  );
  const lastActivityEntryFromHistory = useLastActivityEntryFromHistory({
    campaignId,
    entryKey,
    entry,
  });
  const lastFromHistoryIsSameEF = lastActivityEntryFromHistory?.emissionFactor?.id === entry.emissionFactor?.id;

  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);
  const isEntryWriter = useIsEntryWriter(entry);
  const campaignStatus = useSelector<RootState, CampaignStatus>(
    state => state.campaign.campaigns[campaignId]!.information!.status
  );
  const campaignClosed = [CampaignStatus.IN_PREPARATION, CampaignStatus.IN_PROGRESS].indexOf(campaignStatus) === -1;
  const editionNeverAllowed = (!isManager && !isEntryWriter) || campaignClosed;

  const isEntryLockedByHistory = useIsEntryLockedByHistory({
    campaignId,
    entry,
  });
  const isEFLockedByHistory = isEntryLockedByHistory && computeMethod?.relatedEFAreEditableEvenIfHasHistory === false;

  const [modalForbiddenToModifyMessage, setModalForbiddenToModifyMessage] = useState<string | undefined>(undefined);

  const renderValueComparison = (lastValue: number | undefined, currentValue: number | undefined, campaignYear: number | undefined) => {
    if (!lastFromHistoryIsSameEF || !lastValue) {
      return;
    }

    if (!currentValue) {
      return (
        <p className={cx(styles.valueComparison, styles.raw)}>
          (valeur en {campaignYear} : <span className={cx(styles.valueComparisonValue)}>{lastValue}</span>)
        </p>
      );
    }

    const ratio = 100 * ((currentValue / lastValue) - 1);
    const ratioIsNegative = ratio <= 0;
    const ratioIsStrictlyNegative = ratio < 0;
    const formattedRatio = Math.round(Math.abs(ratio));

    return (
      <p className={cx(styles.valueComparison, {
        [styles.red]: !ratioIsNegative,
        [styles.green]: ratioIsNegative,
      })}>
        {ratioIsStrictlyNegative ? '-' : '+'}{formattedRatio}% ({campaignYear})
      </p>
    );
  }

  return (
    <>
      <EmissionFactorField
        onClickMainDiv={() => {
          if (isEFLockedByHistory) {
            setModalForbiddenToModifyMessage(`${upperFirst(t("entry.history.data.nonModifiable"))} - ${upperFirst(t("entry.history.data.createNewData"))}`)
          } else {
            if (isManager && !campaignClosed) {
              dispatch(initEFChooser(entryKey));
            }
          }
        }}
        entry={entry}
        activityModelId={activityModelId}
        disabled={!isManager || campaignClosed || isEFLockedByHistory}
      />
      <div className={cx(styles.dataFieldContainer, styles.field1)}>
        <Tooltip content={computeMethod?.valueName ?? null} hideDelay={0}>
          <p className={cx(styles.label)}>{isCustomEF ? upperFirst(entry.customEmissionFactor?.input1Name) : computeMethod?.valueName}</p>
        </Tooltip>
        <div className={cx(styles.fieldWithUnit)}>
          <div className="default-field">
            <SelfControlledInput
              validateChange={canBeCoercedToNumber}
              className={cx("field", styles.field)}
              value={entry.value ?? undefined}
              onHtmlChange={(value: string) =>
                save({
                  value: parseAvoidingNaN(value),
                })
              }
              refreshOnBlur
              disabled={editionNeverAllowed}
            />
          </div>
          <p className={cx(styles.unit)}>{entry?.emissionFactor?.input1Unit ?? entry?.emissionFactor?.input1Unit ?? entry.customEmissionFactor?.input1Unit}</p>
        </div>
        {renderValueComparison(lastActivityEntryFromHistory?.value ?? undefined, entry.value ?? undefined, lastActivityEntryFromHistory?.campaignYear)}
      </div>
      {!computeMethod?.value2Name ? null : (
        <div className={cx(styles.dataFieldContainer, styles.field2)}>
          <Tooltip content={computeMethod?.value2Name ?? null} hideDelay={0}>
            <p className={cx(styles.label)}>{computeMethod?.value2Name}</p>
          </Tooltip>
          <div className={cx(styles.fieldWithUnit)}>
            <div className="default-field">
              <SelfControlledInput
                validateChange={canBeCoercedToNumber}
                className={cx("field", styles.field)}
                value={entry.value2 ?? undefined}
                onHtmlChange={(value: string) =>
                  save({
                    value2: parseAvoidingNaN(value),
                  })
                }
                refreshOnBlur
                disabled={editionNeverAllowed}
              />
            </div>
            <p className={cx(styles.unit)}>{
              computeMethod?.specialComputeMode === ComputeMode.ACCOUNTING_DEPRECIATION ? `${t("global.time.y_s")}` : entry?.emissionFactor?.input2Unit
            }</p>
          </div>
          {renderValueComparison(lastActivityEntryFromHistory?.value2 ?? undefined, entry.value2 ?? undefined, lastActivityEntryFromHistory?.campaignYear)}
        </div>
      )}
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

export default ActivityEntryStandardForm;
