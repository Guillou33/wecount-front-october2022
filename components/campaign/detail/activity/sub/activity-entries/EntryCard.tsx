import { memo, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";

import Checkbox from "@components/helpers/ui/CheckboxInput";

import { RootState } from "@reducers/index";
import {
  EntryData,
  WritableEntryData,
} from "@reducers/entries/campaignEntriesReducer";
import { UnitModes } from "@reducers/campaignReducer";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import { PerimeterRole } from "@custom-types/wecount-api/auth";

import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
import useComputeMethodSetup from "./hooks/useComputeMethodSetup";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import useIsEntryOwner from "@hooks/core/perimeterAccessControl/useIsEntryOwner";

import { getComputeMethodsWithEF } from "@actions/core/emissionFactor/emissionFactorActions";
import { setEntryComputeMethod } from "@actions/entries/campaignEntriesAction";

import { getEmissionFactorOrigin } from "@lib/utils/getEmissionFactorOrigin";
import { getEntryUpdater } from "./helpers/getEntryUpdate";
import { areEntryCardPropsEqual } from "./helpers/areEntryCardPropsEqual";

import EditEntry from "@components/campaign/detail/activity/sub/activity-entries/EditEntry";
import Dropdown from "@components/helpers/ui/dropdown/Dropdown";
import ProductSelector from "@components/campaign/detail/activity/sub/activity-entries/form/ProductSelector";
import SiteSelector from "@components/campaign/detail/activity/sub/activity-entries/form/SiteSelector";
import ActivityEntryStatus from "@components/campaign/detail/activity/sub/activity-entries/form/ActivityEntryStatus";
import ResultDisplayer from "@components/core/ResultDisplayer";
import Foldable from "@components/helpers/form/Foldable";
import InstructionModal from "./InstructionModal";
import UserSelector from "@components/campaign/detail/activity/sub/activity-entries/form/UserSelector";
import FeSelectionReminder from "./FeSelectionReminder";

import styles from "@styles/campaign/detail/activity/activityEntries.module.scss";
import { useLastActivityEntryFromHistory } from "./hooks/useLastActivityEntryFromHistory";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import DangerConfirmModal from "@components/helpers/modal/DangerConfirmModal";
import { useIsEntryLockedByHistory } from "./hooks/useIsEntryLockedByHistory";
import { ComputeMethod } from "@reducers/core/emissionFactorReducer";
import { ComputeMode } from "@custom-types/wecount-api/computeMethod";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { handleEntrySelection } from "@actions/entries/listEntriesActions";
import _ from "lodash";
import ModalConfirmDelete from "./ModalConfirmDelete";

function getView(view: string, state: RootState, activityModelId: number | undefined, siteId: string | null){
  switch(view){
    case "list":
      return state.listSelectedEntries.selectedEntries;
    case "activity":
      return activityModelId !== undefined && state.listSelectedEntries.activityEntries[activityModelId] !== undefined ?
        state.listSelectedEntries.activityEntries[activityModelId].selectedEntries :
        [];
    case "sites":
      return siteId && state.listSelectedEntries.siteEntries[siteId] !== undefined ?
        state.listSelectedEntries.siteEntries[siteId].selectedEntries :
        [];
    default:
      return state.listSelectedEntries.selectedEntries;
    
    }
}

export type EntryUpdate = Partial<WritableEntryData>;

export type InstructionData = {
  currentInstruction: string;
  entryKey: string;
  activityModelId: number;
  entry: EntryData;
};

export interface Props {
  entryKey: string;
  entryIndex: number;
  entry: EntryData;
  activityModelId: number;
  siteId: string | null;
  isOpened: boolean;
  totalTco2: number;
  unitMode: UnitModes | undefined;
  // listSelection: (number | string)[];
  view: string;
  campaignId: number;
  onEntryChange: (data: WritableEntryData) => void;
  onToggleCard?: (entryId: string) => void;
  onDuplicate?: (entryId: string) => void;
  onDelete?: (entryId: string) => void;
  onClose?: (entryId: string) => void;
  /*
  wip on selection
  isSelected: boolean;
  onToggleSelect: (entryId: string) => void;
  */
}

const EntryCard = ({
  entryKey,
  entryIndex,
  activityModelId,
  siteId,
  entry,
  isOpened,
  totalTco2,
  unitMode,
  view,
  campaignId,
  onEntryChange,
  onToggleCard,
  onDuplicate,
  onDelete,
  onClose,
}: 
Props) => {
  const dispatch = useDispatch();
  const [isModalConfirmDeleteOpen, setIsModalConfirmDeleteOpen] = useState(false);

  const hasPendingRequest = useSelector<RootState, boolean>(
    state =>
      state.campaignEntries?.[campaignId]?.entries?.[entryKey]
        ?.hasPendingRequest ?? false
  );
  const hasError = useSelector<RootState, boolean>(
    state =>
      state.campaignEntries?.[campaignId]?.entries?.[entryKey]?.hasError ??
      false
  );

  const lastActivityEntryFromHistory = useLastActivityEntryFromHistory({
    campaignId,
    entryKey,
    entry,
  });

  const listSelection = useSelector<RootState, Array<number>>(
    state => getView(view, state, activityModelId, siteId)
  );

  const activityModelInfo = useActivityModelInfo();
  const activityModel = activityModelInfo[activityModelId];

  const withReadOnlyAccessControl = useReadOnlyAccessControl();
  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);
  const isEntryOwner = useIsEntryOwner(entry);

  const isEntryLockedByHistory = useIsEntryLockedByHistory({
    campaignId,
    entry,
  });

  const [modalForbiddenToModifyMessage, setModalForbiddenToModifyMessage] = useState<string | undefined>(undefined);

  const campaignStatus = useSelector<RootState, CampaignStatus>(
    state => state.campaign.campaigns[campaignId]!.information!.status
  );
  const campaignClosed = [CampaignStatus.IN_PREPARATION, CampaignStatus.IN_PROGRESS].indexOf(campaignStatus) === -1;

  const getEntryUpdate = getEntryUpdater(entry);

  function onChangeComputeMethodChoice(computeMethodChoice: string) {
    // If value from selector is an id, it is the compute Method's id
    if (parseInt(computeMethodChoice).toString() === computeMethodChoice) {
      onEntryChange(
        getEntryUpdate({
          value: null,
          value2: null,
          computeMethodId: parseInt(computeMethodChoice),
          computeMethodType: ComputeMethodType.STANDARD,
          emissionFactorId: null,
        })
      );
    } else {
      onEntryChange(
        getEntryUpdate({
          value: null,
          value2: null,
          computeMethodType: computeMethodChoice as ComputeMethodType,
          emissionFactorId: null,
        })
      );
    }
  }

  useComputeMethodSetup({
    entry,
    activityModel,
    onComputeMethodSetup: computeMethodData => {
      dispatch(
        setEntryComputeMethod({
          entryKey,
          campaignId,
          computeMethodType: computeMethodData.computeMethodType,
          computeMethodId: computeMethodData?.computeMethodId ?? null,
        })
      );
    },
  });

  const computeMethods = useSelector(
    (state: RootState) => state.core.emissionFactor.mapping[activityModelId]
  );

  const computeMethod = useSelector<RootState, ComputeMethod | undefined>(
    state =>
      !activityModelId || !entry.computeMethodId
        ? undefined
        : state.core.emissionFactor.mapping?.[activityModelId]?.[
          entry.computeMethodId
        ]
  );

  useEffect(() => {
    if (isOpened && computeMethods == null) {
      dispatch(getComputeMethodsWithEF(activityModelId));
    }
  }, [isOpened, computeMethods, activityModelId]);

  const [editInstruction, setEditInstruction] = useState(false);
  const [remainderAlreadySeen, setRemainerAsSeen] = useState(true);

  const renderTotalComparison = () => {
    if (!lastActivityEntryFromHistory || !lastActivityEntryFromHistory?.resultTco2 || !entry.resultTco2) {
      return;
    }

    const ratio = 100 * ((entry.resultTco2 / lastActivityEntryFromHistory?.resultTco2) - 1);
    const ratioIsNegative = ratio <= 0;
    const ratioIsStrictlyNegative = ratio < 0;
    const formattedRatio = Math.round(Math.abs(ratio));

    return (
      <p className={cx(styles.valueComparison, {
        [styles.red]: !ratioIsNegative,
        [styles.green]: ratioIsNegative,
      })}>
        {ratioIsStrictlyNegative ? '-' : '+'}{formattedRatio}% ({lastActivityEntryFromHistory.campaignYear})
      </p>
    );
  }

  return (
    <div className={cx(styles.entry)}>
      {ModalConfirmDelete({
        entryKey,
        entry,
        activityModel,
        isModalConfirmDeleteOpen,
        setIsModalConfirmDeleteOpen,
        onDelete,
      })}
      <div
        className={cx(styles.header)}
        onClick={e => {
          onToggleCard &&
            e.target === e.currentTarget &&
            onToggleCard(entryKey);
        }}
      >
        <>
          {(entry.id !== undefined) ? (
            <Checkbox
              className={cx(styles.chkAction)}
              checked={listSelection.includes(entry.id)}
              onChange={e =>
                dispatch(
                  handleEntrySelection({
                    id: entry.id,
                    includeId:
                      entry.id !== undefined &&
                      listSelection.includes(entry.id),
                    activityModelId: entry.activityModelId,
                    siteId: siteId ?? "-1",
                    view: view,
                  })
                )
              }
              id={entryKey}
            />
          ) : (
            <div className={cx(styles.chkAction)}></div>
          )}
          <Dropdown
            togglerContent={
              <i className={cx("fa fa-ellipsis-v", styles.moreAction)}></i>
            }
          >
            {entry.id !== undefined && (
              <Dropdown.Item
                onClick={e => {
                  if (isManager) {
                    onDuplicate &&
                      withReadOnlyAccessControl(() => onDuplicate(entryKey))();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                className={cx(styles.actionEntry, {
                  [styles.actionEntryDisabled]: !isManager,
                })}
              >
                <span className={styles.actionEntry}>
                  <i className={cx("fa fa-clone")}></i> {upperFirst(t("global.duplicate"))}
                </span>
              </Dropdown.Item>
            )}
            <Dropdown.Item
              onClick={e => {
                if (isManager) {
                  setIsModalConfirmDeleteOpen(true);
                }
                // onDelete &&
                //   withReadOnlyAccessControl(() => onDelete(entryKey))();
              }}
              className={cx(styles.actionEntry, {
                [styles.actionEntryDisabled]: !isManager,
              })}
            >
              <span className={styles.actionEntry}>
                <i className={cx("fa fa-trash")}></i> {upperFirst(t("global.delete"))}
              </span>
            </Dropdown.Item>
          </Dropdown>
        </>
        <div
          className={styles.mainInfo}
          onClick={() => onToggleCard && onToggleCard(entryKey)}
        >
          <div className={styles.entryOrigin}>
            {activityModel.category.name} {">"} {activityModel.name} {">"}{" "}
            {entry.activityEntryReference?.referenceId}
          </div>
          <div className={styles.entryTitle}>
            {getEmissionFactorOrigin(entry)}
          </div>
          {entry.instruction != null && (
            <div className={styles.entryInstruction}>{entry.instruction}</div>
          )}
        </div>
        {!isOpened && (
          <>
            {entry.value != null && (
              <div
                className={styles.displayInput}
                onClick={() => onToggleCard && onToggleCard(entryKey)}
              >
                {entry.value} {entry.emissionFactor?.input1Unit}
              </div>
            )}
            {entry.value2 != null && (
              <div
                className={styles.displayInput}
                onClick={() => onToggleCard && onToggleCard(entryKey)}
              >
                {entry.value2}{" "}
                {computeMethod?.specialComputeMode ===
                ComputeMode.ACCOUNTING_DEPRECIATION
                  ? t("global.time.y_s")
                  : entry.emissionFactor?.input2Unit}
              </div>
            )}
          </>
        )}
        <span className={styles.sitesProducts}>
          <div
            onClick={() => {
              if (!!isOpened && isEntryLockedByHistory) {
                setModalForbiddenToModifyMessage(
                  `${upperFirst(t("entry.history.data.nonModifiable"))} - ${upperFirst(t("entry.history.data.createNewData"))}`
                );
              }
            }}
          >
            <SiteSelector
              selectedSiteId={entry.siteId}
              onChange={withReadOnlyAccessControl(siteId =>
                onEntryChange(getEntryUpdate({ siteId }))
              )}
              selectorClassName={styles.pseudoCell}
              disabled={!isManager || campaignClosed || isEntryLockedByHistory}
              canBeModified={!!isOpened}
              onClickParent={() => onToggleCard && onToggleCard(entryKey)}
            />
          </div>
          <div
            onClick={() => {
              if (!!isOpened && isEntryLockedByHistory) {
                setModalForbiddenToModifyMessage(
                  `${upperFirst(t("entry.history.data.nonModifiable"))} - ${upperFirst(t("entry.history.data.createNewData"))}`
                );
              }
            }}
          >
            <ProductSelector
              selectedProductId={entry.productId}
              onChange={withReadOnlyAccessControl(productId =>
                onEntryChange(getEntryUpdate({ productId }))
              )}
              selectorClassName={cx(styles.middle, styles.pseudoCell)}
              className={cx(styles.middle)}
              disabled={!isManager || campaignClosed || isEntryLockedByHistory}
              canBeModified={!!isOpened}
              onClickParent={() => onToggleCard && onToggleCard(entryKey)}
            />
          </div>
          <UserSelector
            selectedUserId={entry.ownerId}
            onChange={ownerId => onEntryChange(getEntryUpdate({ ownerId }))}
            tooltipBase="Owner"
            filterShowedUsers={user =>
              user.roleWithinPerimeter !==
                PerimeterRole.PERIMETER_CONTRIBUTOR &&
              user.roleWithinPerimeter !== PerimeterRole.PERIMETER_COLLABORATOR
            }
            disabled={!isManager || campaignClosed}
          />
          <UserSelector
            selectedUserId={entry.writerId}
            onChange={writerId => {
              onEntryChange(getEntryUpdate({ writerId }));
              setRemainerAsSeen(false);
            }}
            tooltipBase="Writer"
            disabled={(!isManager && !isEntryOwner) || campaignClosed}
          />
          <ActivityEntryStatus
            status={entry.status}
            save={withReadOnlyAccessControl(status =>
              onEntryChange(getEntryUpdate(status))
            )}
            showStatusText={false}
            className={styles.pseudoCell}
            disabled={!isManager && !isEntryOwner}
          />
        </span>
        <div
          className={styles.result}
          onClick={() => onToggleCard && onToggleCard(entryKey)}
        >
          <ResultDisplayer
            tco2={entry.resultTco2}
            total={totalTco2}
            unitMode={unitMode}
          />
          {isOpened && renderTotalComparison()}
        </div>
      </div>
      <div
        className={cx(styles.entryMainContent, { [styles.opened]: isOpened })}
      >
        <Foldable isOpen={isOpened}>
          <EditEntry
            isVisible={isOpened}
            entryKey={entryKey}
            campaignId={campaignId}
            isLoading={hasPendingRequest}
            hasError={hasError}
            activityModelId={activityModelId}
            save={withReadOnlyAccessControl(data =>
              onEntryChange(getEntryUpdate(data))
            )}
            onClose={() => onClose && onClose(entryKey)}
            entry={entry}
            standardComputationOff={activityModel.onlyManual}
            helpIframe={activityModel.helpIframe}
            onEditInstructionRequested={() => setEditInstruction(true)}
          />
        </Foldable>
      </div>
      <InstructionModal
        isOpened={editInstruction}
        instruction={entry.instruction ?? ""}
        onEditInstruction={instruction =>
          onEntryChange(getEntryUpdate({ instruction }))
        }
        onClose={() => setEditInstruction(false)}
      />
      <FeSelectionReminder
        remainderAlreadySeen={remainderAlreadySeen}
        hasEmptyEf={
          entry.emissionFactorId === null &&
          entry.computeMethodType === ComputeMethodType.STANDARD
        }
        hasEmptySite={entry.siteId === null}
        hasEmptyProduct={entry.productId === null}
        hasEmptyTags={entry.entryTagIds.length === 0}
        writerId={entry.writerId}
        setAsSeen={() => setRemainerAsSeen(true)}
      />
      <DangerConfirmModal
        question={`${upperFirst(t("entry.history.data.nonModifiable"))} - ${upperFirst(t("entry.history.data.createNewData"))}`}
        btnText="OK"
        onConfirm={() => setModalForbiddenToModifyMessage(undefined)}
        small
        onClose={() => setModalForbiddenToModifyMessage(undefined)}
        open={!!modalForbiddenToModifyMessage}
        spinnerOn={false}
      ></DangerConfirmModal>
    </div>
  );
};

export default EntryCard;

export const EntryCardMemo = memo(EntryCard, areEntryCardPropsEqual);
