import { useState, useEffect } from "react";

import cx from "classnames";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";

import styles from "@styles/campaign/detail/activity/sub/activity-entries/editEntry.module.scss";
import { EntryUpdate } from "@components/campaign/detail/activity/sub/activity-entries/EntryCard";
import { EntryData } from "@reducers/entries/campaignEntriesReducer";
import { Status } from "@custom-types/core/Status";

import ActivityEntryStandardForm from "./form/ActivityEntryStandardForm";
import ActivityEntryEmissionFactorForm from "./form/ActivityEntryEmissionFactorForm";
import ActivityEntryEmissionDirectTco2Form from "./form/ActivityEntryDirectTco2Form";
import ActivityEntryUncertainty from "./form/ActivityEntryUncertainty";
import ActivityEntryComments from "./form/ActivityEntryComments";
import { getEmissionFactorText } from "@lib/utils/getEmissionFactorText";
import { uncertaintyCalculator, roundTwoDecimals } from "@lib/utils/calculator";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import InputInstruction from "./InputInstruction";
import DangerConfirmModal from "@components/helpers/modal/DangerConfirmModal";
import ActivityEntryTagsSelector from "./form/ActivityEntryTagsSelector";

import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import useIsEntryOwner from "@hooks/core/perimeterAccessControl/useIsEntryOwner";
import { requestEntrySubmission, requestFetchHistory } from "@actions/entries/campaignEntriesAction";
import useIsEntryWritterStrictly from "@hooks/core/perimeterAccessControl/useIsEntryWritterStrictly";
import RemoveEntryFromTrajectory from "./RemoveEntryFromTrajectory";
import { sendHelpInfo } from "@actions/analytics/analyticsActions";
import EntryReferenceHistory from "./EntryReferenceHistory";
import { analyticEvents, EventType, HelpEventType } from "@custom-types/core/AnalyticEvents";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { formatDateWithLanguage } from "@lib/translation/config/dates";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { RootState } from "@reducers/index";
import { EmissionFactorModalChoice } from "@reducers/emissionFactorChoice/emissionFactorChoiceReducer";
import ActivityEntryComputeMethod from "./form/ActivityEntryComputeMethod";

interface Props {
  campaignId: number;
  entry: EntryData;
  entryKey: string;
  activityModelId: number | undefined;
  standardComputationOff: boolean;
  helpIframe: string | null;
  isLoading: boolean;
  hasError: boolean;
  isVisible: boolean;
  save: (data: EntryUpdate) => void;
  onClose: () => void;
  onEditInstructionRequested: () => void;
}

const EditEntry = ({
  campaignId,
  entry,
  entryKey,
  activityModelId,
  save,
  onClose,
  standardComputationOff,
  onEditInstructionRequested,
  helpIframe,
  isLoading,
  hasError,
  isVisible,
}: Props) => {
  const dispatch = useDispatch();


  const lastEFModalChoice = useSelector<RootState, EmissionFactorModalChoice | undefined>(state => state.emissionFactorChoice.lastChoice);

  useEffect(() => {
    if (lastEFModalChoice?.entryKey !== entryKey) {
      return;
    }
    if (lastEFModalChoice.computeMethodType === ComputeMethodType.STANDARD) {
      let additionalData: {[key: string]: any} = {};
      if (entry.computeMethodType !== ComputeMethodType.STANDARD) {
        additionalData = {
          value: null,
          value2: null,
        }
      }
      save({
        computeMethodType: lastEFModalChoice.computeMethodType,
        computeMethodId: lastEFModalChoice.computeMethodId,
        emissionFactorId: lastEFModalChoice.emissionFactorId,
        customEmissionFactorId: null,
        ...additionalData,
      });
      return;
    }
    if (lastEFModalChoice.computeMethodType === ComputeMethodType.RAW_DATA) {
      save({
        value: null,
        value2: null,
        computeMethodId: null,
        computeMethodType: lastEFModalChoice.computeMethodType,
        emissionFactorId: null,
        customEmissionFactorId: null,
      })
      return;
    }
    if (lastEFModalChoice.computeMethodType === ComputeMethodType.CUSTOM_EMISSION_FACTOR) {
      save({
        value: null,
        value2: null,
        computeMethodType: lastEFModalChoice.computeMethodType,
        computeMethodId: null,
        emissionFactorId: null,
        customEmissionFactorId: lastEFModalChoice.customEmissionFactorId,
      })
      return;
    }
  }, [lastEFModalChoice]);

  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);
  const isEntryOwner = useIsEntryOwner(entry);
  const isEntryWriterStrictly = useIsEntryWritterStrictly(entry);

  useEffect(() => {
    if (isVisible && entry.id) {
      dispatch(requestFetchHistory({
        campaignId,
        activityEntryId: entry.id,
        activityEntryKey: entryKey,
      }));
    }
  }, [isVisible])

  const [askSubmissionConfirmation, setAskSubmissionConfirmation] =
    useState(false);

  return (
    <div className={styles.editEntry}>
      <div className={styles.formContainerWrapper}>
        <div className={styles.topContainer}>
          {helpIframe && (
            <>
              <div className={styles.helpContainer}>
                <i
                  className={cx("far fa-question-circle", styles.helpIcon)}
                ></i>
                <span className={styles.helpText}>
                  {upperFirst(t("help.fillData"))} ?
                </span>
                <a
                  href={helpIframe}
                  target="_blank"
                  className={styles.helpLink}
                  onClick={() => dispatch(sendHelpInfo({ eventName: analyticEvents[EventType.HELP][HelpEventType.ENTRY], campaignId }))}
                >
                  {t("global.see")}
                </a>
              </div>
              <div className={cx(styles.separator, styles.left)}></div>
            </>
          )}
          <InputInstruction
            instruction={entry.instruction}
            onEditInstructionRequested={onEditInstructionRequested}
            isEditionAllowed={isManager || isEntryOwner}
          />
          <div className={cx(styles.separator)}></div>
          <ActivityEntryTagsSelector
            tagIds={entry.entryTagIds}
            save={save}
            disabled={!isManager}
          />
          <div className={cx(styles.separator)}></div>
          <ActivityEntryComputeMethod
            campaignId={campaignId}
            entry={entry}
            entryKey={entryKey}
            activityModelId={activityModelId}
          />
        </div>
        <div
          className={cx(styles.formContainer, {
            [styles.directTco2Container]:
              entry.computeMethodType === ComputeMethodType.RAW_DATA,
            // For old custom emission factor entries
            [styles.emissionFactorContainer]:
              entry.computeMethodType === ComputeMethodType.DEPRECATED_EMISSION_FACTOR,
          })}
        >
          {entry.computeMethodType && [ComputeMethodType.STANDARD, ComputeMethodType.CUSTOM_EMISSION_FACTOR].includes(entry.computeMethodType) && (
            <ActivityEntryStandardForm
              entry={entry}
              save={save}
              activityModelId={activityModelId}
              campaignId={campaignId}
              entryKey={entryKey}
            />
          )}
          {/* For old custom emission factor entries */}
          {entry.computeMethodType === ComputeMethodType.DEPRECATED_EMISSION_FACTOR && (
            <>
              <ActivityEntryEmissionFactorForm entry={entry} save={save} campaignId={campaignId} />
              <p className={styles.computationMethodHelp}>
                <i className="fas fa-info-circle"></i>
                {upperFirst(t("entry.computeMethod.infoComputation"))}
              </p>
            </>
          )}
          {entry.computeMethodType === ComputeMethodType.RAW_DATA && (
            <>
              <ActivityEntryEmissionDirectTco2Form entryKey={entryKey} entry={entry} save={save} campaignId={campaignId} />
              <p className={styles.computationMethodHelp}>
                <i className="fas fa-info-circle"></i>
                {upperFirst(t("help.computeMethod"))}
              </p>
            </>
          )}
          <ActivityEntryUncertainty
            campaignId={campaignId}
            entry={entry}
            save={save}
            className={styles.uncertainty}
          />
          <div className={cx(styles.infoContainer, {[styles.smallHeight]: entry.customEmissionFactor?.id})}>
            <Info iconFile="icon-percent-copy.svg" label={upperFirst(t("entry.emission.emissionFactor"))}>
              {getEmissionFactorText(
                entry.emissionFactor?.value ?? entry.customEmissionFactor?.value,
                entry.emissionFactor?.unit ?? (entry.customEmissionFactor ? `${t('footprint.emission.kgco2.kgco2e')}/${entry.customEmissionFactor.input1Unit}` : undefined)
              )}
            </Info>
            {
              !entry.customEmissionFactor?.id && (
                <Info
                  iconFile="icon-emission-gef.svg"
                  label={upperFirst(t("entry.emission.uncertainty"))}
                >
                  {`${entry.emissionFactor?.uncertainty ?? 0} %`}
                </Info>
              )
            }
            <Tooltip content={entry.emissionFactor?.source ?? entry.customEmissionFactor?.source}>
              <span className={styles.efSourceWrapper}>
                <Info
                  iconFile="icon-box-brighter.svg"
                  label={upperFirst(t("entry.emission.source"))}
                >
                  {entry.emissionFactor?.dbName ?? (entry.customEmissionFactor ? upperFirst(t('footprint.emission.customEmissionFactor')) : undefined) ?? "n/a"}
                </Info>
              </span>
            </Tooltip>

            <Info iconFile="icon-percent.svg" label={upperFirst(t("entry.emission.computedUncertainty"))}>
              {`${formatNumberWithLanguage(roundTwoDecimals(
                uncertaintyCalculator(
                  entry.emissionFactor?.uncertainty ?? 0,
                  entry.uncertainty
                ) * 100
              ))}%`}
            </Info>
          </div>
          <ActivityEntryComments entry={entry} save={save} />
        </div>
        <EntryReferenceHistory
          activityModelId={entry.activityModelId}
          editEntryIsVisible={isVisible}
          campaignId={campaignId}
          entryKey={entryKey}
          currentEntry={entry}
        />
      </div>
      <div className={cx(styles.historyAndExclude)}>
        <RemoveEntryFromTrajectory
          entryKey={entryKey}
          entry={entry}
          save={save}
        />
      </div>
      <div className={styles.closeButtonContainer}>
        {isLoading && (
          <span className={styles.lastSavedDate}>
            <span className="spinner-border spinner-border-sm mr-2"></span>
              {upperFirst(t("global.savingInProgress"))}
            </span>
        )}
        {!hasError && !isLoading && (
          <i className={cx("far fa-check-circle", styles.noErrorIcon)}></i>
        )}
        {entry.updatedAt != null && !isLoading && (
          <span className={styles.lastSavedDate}>
            {upperFirst(t("global.adjective.modified"))} {t("global.time.on")} {formatDateWithLanguage(entry.updatedAt)}
          </span>
        )}
        {isEntryWriterStrictly && entry.status === Status.IN_PROGRESS && (
          <button
            className={cx("button-1", styles.submitEntryButton)}
            onClick={() => {
              if (entry.id != null) {
                setAskSubmissionConfirmation(true);
              } else {
                onClose();
              }
            }}
          >
            {upperFirst(t("global.submit"))}
          </button>
        )}
        <button type="button" className="button-1" onClick={onClose}>
          {upperFirst(t("global.save"))}
        </button>
      </div>
      <DangerConfirmModal
        question={
          <div className="color-1 text-center">
            <p>
              <strong>{upperFirst(t("entry.submitQuestion"))} ?</strong>
            </p>
          </div>
        }
        btnText={upperFirst(t("global.other.yes"))}
        btnDanger={false}
        onConfirm={() => {
          if (entry.id != null) {
            dispatch(
              requestEntrySubmission({
                campaignId,
                entryKey,
                entryId: entry.id,
              })
            );
          }
          setAskSubmissionConfirmation(false);
        }}
        open={askSubmissionConfirmation}
        onClose={() => setAskSubmissionConfirmation(false)}
        small
      />
    </div>
  );
};

export default EditEntry;

interface InfoProps {
  iconFile: string;
  label: string;
  children: string;
}

const Info = ({ iconFile, label, children }: InfoProps) => {
  return (
    <div className={styles.info}>
      <img
        src={`/icons/modale/${iconFile}`}
        alt=""
        className={styles.infoIcon}
      />
      <div className={styles.labelAndValue}>
        <p className={styles.infoLabel}>{label}</p>
        <p className={styles.infoValue}>{children}</p>
      </div>
    </div>
  );
};
