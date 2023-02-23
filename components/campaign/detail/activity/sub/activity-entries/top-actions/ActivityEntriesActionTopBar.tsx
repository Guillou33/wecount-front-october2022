import React from "react";
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";

import Checkbox from "@components/helpers/ui/CheckboxInput";
import Dropdown from "@components/helpers/ui/dropdown/Dropdown";

import styles from "@styles/campaign/detail/activity/sub/activityEntriesTopBarActions.module.scss";

import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import { PerimeterRole } from "@custom-types/wecount-api/auth";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { checkAllSelectedEntries, checkOneSelectedEntry, getSelectedEntries } from "../helpers/checkEntriesSelection";

import { RootState } from "@reducers/index";
import { handleAllEntriesSelection } from "@actions/entries/listEntriesActions";
import { ModalEntriesStatus, ModalEntriesRemove } from "./Modals";
import { getPluralSelection } from "@lib/utils/textRenderer";
import { upperFirst } from "lodash";
import { t } from "i18next";

const checkAllSelectedEntriesInActivity = (
  listSelection: Array<number>,
  editEntries: ActivityEntryExtended[]
) => checkAllSelectedEntries(listSelection, editEntries);

const checkOneSelectedEntryInActivity = (
  listSelection: Array<number>,
  editEntries: ActivityEntryExtended[]
) => checkOneSelectedEntry(listSelection, editEntries);

interface Props {
  editEntries: ActivityEntryExtended[];
  listSelection: number[];
  activityModelId: number | undefined;
  siteId?: string;
  view: string;
}

const ActivityEntriesActionTopBar = ({
  editEntries,
  listSelection,
  activityModelId,
  siteId,
  view
}: Props) => {
    const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);

    const [isModalStatusSelectionActionOpen, setIsModalStatusSelectionActionOpen] = React.useState(false);
    const [isModalRemoveSelectionActionOpen, setIsModalRemoveSelectionActionOpen] = React.useState(false);

    const dispatch = useDispatch();

    let checkAllSelectedEntries = checkAllSelectedEntriesInActivity(listSelection, editEntries);
    let checkOneSelectedEntry = checkOneSelectedEntryInActivity(listSelection, editEntries);

    const selectedEntries = getSelectedEntries(listSelection, editEntries);

    const areActionsAllowed = isManager && selectedEntries.length > 0;

    return (
      <div className={cx(styles.topBarListingActions)}>
        <ModalEntriesStatus 
          selectedEntries={selectedEntries}
          isModalStatusSelectionActionOpen={isModalStatusSelectionActionOpen}
          setIsModalStatusSelectionActionOpen={setIsModalStatusSelectionActionOpen}
        />
        <ModalEntriesRemove
          selectedEntries={selectedEntries}
          activityModelId={activityModelId}
          view={view}
          isModalRemoveSelectionActionOpen={isModalRemoveSelectionActionOpen}
          setIsModalRemoveSelectionActionOpen={setIsModalRemoveSelectionActionOpen}
        />
        <div className={cx(styles.chkListActionTop)}>
          <Checkbox
            className={cx(styles.chkActionTop)}
            checked={checkAllSelectedEntries}
            partiallyChecked={checkOneSelectedEntry && !checkAllSelectedEntries}
            onChange={() => dispatch(handleAllEntriesSelection({
              isChecked: !checkOneSelectedEntry,
              entries: editEntries,
              activityModelId: activityModelId,
              siteId: view === "sites" ? siteId?.toString() : undefined,
              view: view
            }))}
            id="select-all-entries"
          />
        </div>
        <div className={cx(styles.dropdownMoreActionTop)}>
          <Dropdown
            togglerContent={
              <i className={cx("fa fa-ellipsis-v", styles.moreActionTop)}></i>
            }
          >
            <Dropdown.Item
              className={areActionsAllowed ? styles.entryActionTop : styles.disabledEntryActionTop}
              onClick={e => {
                if(areActionsAllowed){
                  setIsModalStatusSelectionActionOpen(true);
                }
              }}
            >
              <i className={cx("fa fa-tasks")}></i> {upperFirst(t("entry.status.modify"))}
            </Dropdown.Item>
            {/* <Dropdown.Item
              onClick={e => {
                if(selectedEntries.length > 0){
                  // onDuplicate &&
                  //   withReadOnlyAccessControl(() => onDuplicate(entryKey))();
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }
              }}
            >
              <span className={selectedEntries.length > 0 ? styles.entryActionTop : styles.disabledEntryActionTop}>
                <i className={cx("fa fa-clone")}></i> Dupliquer la sélection
              </span>
            </Dropdown.Item> */}
            <Dropdown.Item
              className={areActionsAllowed ? styles.entryActionTop : styles.disabledEntryActionTop}
              onClick={e => {
                if(areActionsAllowed){
                  setIsModalRemoveSelectionActionOpen(true);
                }
              }}
            >
              <i className={cx("fa fa-trash")}></i> {upperFirst(t("entry.selection.delete"))}
            </Dropdown.Item>
          </Dropdown>
        </div>
          <p className={cx(styles.nbrSelected)}>
            {selectedEntries.length > 0 ? 
              `(${selectedEntries.length} ${getPluralSelection(selectedEntries.length)})`
            : ""}
          </p>
      </div>
    )
};

export default ActivityEntriesActionTopBar;