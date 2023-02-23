import React, { Dispatch, SetStateAction } from 'react';
import ClassicModal from "@components/helpers/modal/ClassicModal";

import styles from "@styles/campaign/detail/activity/sub/activityEntriesTopBarActions.module.scss";
import cx from "classnames";

import { useDispatch, useSelector } from 'react-redux';
import { requestDeleteEntriesInList, setStatusForEntries } from '@actions/entries/campaignEntriesAction';
import { handleAllEntriesSelection } from '@actions/entries/listEntriesActions';

import ActivityEntryStatus from '../form/ActivityEntryStatus';

import { getEmissionFactorOrigin } from '@lib/utils/getEmissionFactorOrigin';

import useUserHasPerimeterRole from '@hooks/core/perimeterAccessControl/useUserHasPerimeterRole';
import useReadOnlyAccessControl from '@hooks/core/readOnlyMode/useReadOnlyAccessControl';
import useActivityModelInfo from '@hooks/core/useActivityModelInfo';

import { PerimeterRole } from '@custom-types/wecount-api/auth';
import { Status } from '@custom-types/core/Status';

import { ActivityEntryExtended } from '@selectors/activityEntries/selectActivityEntriesOfCampaign';
import { RootState } from '@reducers/index';
import { getPluralForDataSelection } from '@lib/utils/textRenderer';
import { upperFirst } from 'lodash';
import { t } from 'i18next';

export const ModalEntriesStatus = ({
    selectedEntries,
    isModalStatusSelectionActionOpen,
    setIsModalStatusSelectionActionOpen
}: {
    selectedEntries: ActivityEntryExtended[],
    isModalStatusSelectionActionOpen: boolean,
    setIsModalStatusSelectionActionOpen: Dispatch<SetStateAction<boolean>>
}) => {
    
    const [statusForAll, setStatusForAll] = React.useState({status: Status.IN_PROGRESS});

    const dispatch = useDispatch();
    
    const withReadOnlyAccessControl = useReadOnlyAccessControl();
    const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);
    
    const activityModelInfo = useActivityModelInfo();

    return (
      <ClassicModal
        open={isModalStatusSelectionActionOpen}
        onClose={() => {
          setIsModalStatusSelectionActionOpen(false);
        }}
        small={false}
      >
      <div className={cx(styles.modalHeader)}>
        <h2>
          <i className={cx("fa fa-tasks")} style={{marginRight: 15}}></i>
          {upperFirst(t("status.change"))} {selectedEntries.length
          } {getPluralForDataSelection(selectedEntries.length)
          }
        </h2>
      </div>
      <div className={cx(styles.modalBody)}>
        <div className={cx(styles.actionsModal)}>
          <ActivityEntryStatus
            status={statusForAll.status}
            save={(status: any) => setStatusForAll({status: status.status})}
            showStatusText={false}
            className={styles.pseudoCell}
            disabled={!isManager}
          />
          <div className={cx(styles.btnActionsModal)}>
            <button
              className={cx(styles.btnModal, "button-2")}
              onClick={() => setIsModalStatusSelectionActionOpen(false)}
            >
              {upperFirst(t("global.cancel"))}
            </button>
            <button
              className={cx(styles.btnModal, "button-1")}
              onClick={() => {
                withReadOnlyAccessControl(() => {
                  dispatch(
                    setStatusForEntries({
                      status: statusForAll.status,
                      list: selectedEntries.filter(entry => entry.id !== undefined && !entry.entryKey.includes("temp")).map(entry => entry.id),
                    })
                  )
                })();
                setIsModalStatusSelectionActionOpen(false);
              }}
            >
              {upperFirst(t("global.confirm"))}
            </button>
          </div>
        </div>
        <div className={cx(styles.shownEntriesSelected)}>
          {selectedEntries.map((entry, index) => {
            const activityModel = activityModelInfo[entry.activityModelId];
            return (
              <div
                key={index}
                className={styles.mainInfo}
              >
                <div className={styles.entryOrigin}>
                  {activityModel.category.name} {">"} {activityModel.name} {">"}{" "}
                  {entry.activityEntryReference?.referenceId}
                </div>
                <div className={styles.entryTitle}>
                  {getEmissionFactorOrigin(entry)}
                </div>
                {entry.instruction != null && (
                  <div className={styles.entryInstruction}>
                    {entry.instruction}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className={cx(styles.modalFooter)}>
        <button
          className={cx(styles.btnModal, "button-2")}
          onClick={() => setIsModalStatusSelectionActionOpen(false)}
        >
          Annuler
        </button>
        <button
          className={cx(styles.btnModal, "button-1")}
          onClick={() => {
            withReadOnlyAccessControl(() => {
              dispatch(
                setStatusForEntries({
                  status: statusForAll.status,
                  list: selectedEntries.filter(entry => entry.id !== undefined && !entry.entryKey.includes("temp")).map(entry => entry.id),
                })
              )
            })();
            setIsModalStatusSelectionActionOpen(false);
          }}
        >
          Confirmer
        </button>
      </div> */}
    </ClassicModal>
    );
  }

export const ModalEntriesRemove = ({
  selectedEntries,
  activityModelId,
  view,
  isModalRemoveSelectionActionOpen,
  setIsModalRemoveSelectionActionOpen
}: {
  selectedEntries: ActivityEntryExtended[],
  activityModelId: number | undefined,
  view: string,
  isModalRemoveSelectionActionOpen: boolean,
  setIsModalRemoveSelectionActionOpen: Dispatch<SetStateAction<boolean>>
}) => {
    const withReadOnlyAccessControl = useReadOnlyAccessControl();

    const dispatch = useDispatch();
    const campaignId = useSelector<RootState, number>(
      state => state.campaign.currentCampaign!
    );

    const activityModelInfo = useActivityModelInfo();

    return (
      <ClassicModal
        open={isModalRemoveSelectionActionOpen}
        onClose={() => {
          setIsModalRemoveSelectionActionOpen(false);
        }}
        small={false}
      >
      <div className={cx(styles.modalHeader)}>
        <h2>
          <i className={cx("fa fa-trash")} style={{marginRight: 15}}></i>
          {upperFirst(t("global.delete"))} {selectedEntries.length
            } {getPluralForDataSelection(selectedEntries.length)
            }
        </h2>
      </div>
      <div className={cx(styles.modalBody)}>
        <div className={cx(styles.actionsModal)}>
          <div className={cx(styles.pseudoCell)}></div>
          <div className={cx(styles.btnActionsModal)}>
            <button
              className={cx(styles.btnModal, "button-2")}
              onClick={() => setIsModalRemoveSelectionActionOpen(false)}
            >
              {upperFirst(t("global.cancel"))}
            </button>
            <button
              className={cx(styles.btnModal, "button-danger")}
              onClick={() => {
                withReadOnlyAccessControl(() => {
                  dispatch(
                    requestDeleteEntriesInList({
                      campaignId,
                      list: selectedEntries.filter(entry => entry.id !== undefined).map(entry => entry.entryKey)
                    })
                  )
                })();
                dispatch(handleAllEntriesSelection({
                  isChecked: false,
                  entries: [],
                  activityModelId: activityModelId,
                  view: view
                }))
                setIsModalRemoveSelectionActionOpen(false);
              }}
            >
              {upperFirst(t("global.delete"))}
            </button>
          </div>
        </div>
        <div className={cx(styles.shownEntriesSelected)}>
          {selectedEntries.map((entry, index) => {
            const activityModel = activityModelInfo[entry.activityModelId];
            return (
              <div
                key={index}
                className={styles.mainInfo}
              >
                <div className={styles.entryOrigin}>
                  {activityModel.category.name} {">"} {activityModel.name} {">"}{" "}
                  {entry.activityEntryReference?.referenceId}
                </div>
                <div className={styles.entryTitle}>
                  {getEmissionFactorOrigin(entry)}
                </div>
                {entry.instruction != null && (
                  <div className={styles.entryInstruction}>
                    {entry.instruction}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* <div className={cx(styles.modalFooter)}>
        <button
          className={cx(styles.btnModal, "button-2")}
          onClick={() => setIsModalRemoveSelectionActionOpen(false)}
        >
          Annuler
        </button>
        <button
          className={cx(styles.btnModal, "button-danger")}
          onClick={() => {
            withReadOnlyAccessControl(() => {
              dispatch(
                requestDeleteEntriesInList({
                  campaignId,
                  list: selectedEntries.filter(entry => entry.id !== undefined).map(entry => entry.entryKey)
                })
              )
            })();
            dispatch(handleAllEntriesSelection({
              isChecked: !checkAllSelectedEntries,
              campaignId: campaignId,
              entries: [],
              activityModelId: activityModelId,
              view: view
            }))
            setIsModalRemoveSelectionActionOpen(false);
          }}
        >
          Supprimer
        </button>
      </div> */}
    </ClassicModal>
    );
  }

