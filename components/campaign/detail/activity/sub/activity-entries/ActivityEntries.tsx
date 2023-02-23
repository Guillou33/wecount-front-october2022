import cx from "classnames";
import { useEffect } from "react";

import { getComputeMethodsWithEF } from "@actions/core/emissionFactor/emissionFactorActions";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { ActivityEditState } from "@reducers/activity/editReducer";
import { ComputeMethodMapping } from "@reducers/core/emissionFactorReducer";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import styles from "@styles/campaign/detail/activity/activityEntries.module.scss";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
import IfHasPerimeterRole from "@components/auth/access-control/IfHasPerimeterRole";
import { PerimeterRole } from "@custom-types/wecount-api/auth";

import selectFilteredActivityEntriesForCartography from "@selectors/activityEntries/selectFilteredActivityEntriesForCartography";
import selectIsCartographyFiltered from "@selectors/filters/selectIsCartographyFiltered";
import selectActivityEntriesOfCampaign from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import getEntryInfoByActivityModel from "@lib/core/activityEntries/getEntryInfoByActivityModel";
import { getInitialEntryInfo } from "@lib/core/activityEntries/entryInfo";

import useFirstDataFromFilters from "@hooks/core/editEntries/useFirstDataFromFilters";
import useIsCardOpened from "@hooks/core/cardExpansion/useIsCardOpened";

import { EntryCardMemo } from "./EntryCard";
import { UnitModes } from "@reducers/campaignReducer";
import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";
import {
  closeCard,
  toggleCard,
} from "@actions/cardExpansion/cardExpansionActions";

import {
  requestUpdateEntry,
  addBlankEntry,
  requestDeleteEntry,
  duplicateEntry
} from "@actions/entries/campaignEntriesAction";
import EntriesResultRecap from "@components/campaign/detail/sub/EntriesResultRecap";
import moment from "moment";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import ActivityEntriesActionTopBar from "./top-actions/ActivityEntriesActionTopBar";
import useInfiniteScrollPagination from "@hooks/utils/useInfiniteScrollPagination";
import { useModalContext } from "@hooks/core/modals/useModalContainerRef";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import { upperFirst } from "lodash";
import { t } from "i18next";

const ActivityEntries = () => {
  const dispatch = useDispatch();
  const withReadOnlyAccessControl = useReadOnlyAccessControl();
  const isCardOpened = useIsCardOpened(CardExpansionNames.EDIT_ENTRIES);

  const campaignId = useSelector<RootState, number>(
    state => state.campaign.currentCampaign!
  );

  const campaignStatus = useSelector<RootState, CampaignStatus>(
    state => state.campaign.campaigns[campaignId]!.information!.status
  );

  const activityModels = useActivityModelInfo();
  const editState = useSelector<RootState, ActivityEditState>(
    state => state.activity.edit
  );
  const entries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForCartography(state, campaignId)
  );
  const editEntries = entries
    .filter(entry => entry.activityModelId === editState.activityModelId)
    .sort((entryA, entryB) => entryB.entryKey.localeCompare(entryA.entryKey));

  const computeMethodMapping = useSelector<
    RootState,
    ComputeMethodMapping | undefined
  >(state =>
    !editState.activityModelId
      ? {}
      : state.core.emissionFactor.mapping[editState.activityModelId]
  );

  const activityModel = !editState.activityModelId
    ? undefined
    : activityModels[editState.activityModelId];

  const unitMode = useSelector<RootState, UnitModes | undefined>(
    state => state.campaign.campaigns[campaignId]?.unitMode
  );

  const allEntries = useSelector((state: RootState) =>
    selectActivityEntriesOfCampaign(state, campaignId)
  );
  const entryInfoTotal =
    getEntryInfoByActivityModel(allEntries)[activityModel?.id ?? -1] ??
    getInitialEntryInfo();

  const areEntriesFiltered = useSelector(selectIsCartographyFiltered);

  const listSelection = useSelector<RootState, Array<number>>(
    state => state.listSelectedEntries.activityEntries[activityModel?.id ?? -1] !== undefined ? 
      state.listSelectedEntries.activityEntries[activityModel?.id ?? -1].selectedEntries :
      []
  );

  const { firstStatus, firstSiteId, firstProductId, entryTagIds } =
    useFirstDataFromFilters();

  useEffect(() => {
    if (editState.activityModelId) {
      dispatch(getComputeMethodsWithEF(editState.activityModelId));
    }
  }, [editState.isEditing]);

  const onAddEntryClick = () => {
    if (activityModel != null) {
      dispatch(
        addBlankEntry({
          status: firstStatus,
          siteId: firstSiteId,
          productId: firstProductId,
          campaignId,
          activityModelId: activityModel.id,
          entryTagIds,
        })
      );
    }
  };

  const root = useModalContext();
  const { containerRef, listSize } = useInfiniteScrollPagination(editEntries, {
    root,
  });

  const entriesNotReady =
    !activityModel ||
    (!Object.values(computeMethodMapping ?? {}).length &&
      !activityModel.onlyManual);

  const filteredEntries = entriesNotReady
    ? []
    : editEntries
        .sort((entry1, entry2) => {
          const entry1Date = moment(entry1.createdAt).unix();
          const entry2Date = moment(entry2.createdAt).unix();
          return entry1Date > entry2Date ? -1 : entry2Date > entry1Date ? 1 : 0;
        })
        .slice(0, listSize)
        .map((entry, index, entries) => (
          <EntryCardMemo
            key={entry.entryKey}
            entryKey={entry.entryKey}
            entry={entry}
            campaignId={campaignId}
            activityModelId={activityModel!.id} // activityModel nullability is checked in entriesNotReady so it can't be null at this point
            siteId={entry.siteId?.toString() ?? null}
            entryIndex={entries.length - index - 1}
            isOpened={isCardOpened(entry.entryKey)}
            totalTco2={entryInfoTotal.tCo2}
            unitMode={unitMode}
            view={"activity"}
            onEntryChange={entryUpdated => {
              dispatch(
                requestUpdateEntry({
                  campaignId,
                  entryKey: entry.entryKey,
                  activityModelId: entry.activityModelId,
                  entryId: entry.id,
                  entryData: entryUpdated,
                })
              );
            }}
            onToggleCard={cardId =>
              dispatch(
                toggleCard({
                  cardExpansionName: CardExpansionNames.EDIT_ENTRIES,
                  cardId,
                })
              )
            }
            onClose={cardId =>
              dispatch(
                closeCard({
                  cardExpansionName: CardExpansionNames.EDIT_ENTRIES,
                  cardId,
                })
              )
            }
            onDuplicate={() =>
              dispatch(
                duplicateEntry({
                  cardExpansionName: CardExpansionNames.EDIT_ENTRIES,
                  activityEntryId:
                    entry?.id && entry?.id !== undefined ? entry.id : null,
                  computeMethodId: entry?.computeMethodId,
                  campaignId: campaignId,
                })
              )
            }
            onDelete={() =>
              dispatch(
                requestDeleteEntry({
                  campaignId,
                  entryKey: entry.entryKey,
                  entryId: entry.id,
                })
              )
            }
          />
        ));

  function editEntriesRendered() {
    if (entriesNotReady) {
      return (
        <div className="d-flex mt-5 align-items-center">
          <div className="spinner-border text-secondary mr-3"></div>
          <div>{upperFirst(t("global.data.loadingData"))}...</div>
        </div>
      );
    }
    if (filteredEntries.length === 0 && areEntriesFiltered) {
      return (
        <div className="mt-5 text-center font-italic font-weight-light">
          {upperFirst(t("filter.noResult"))}
        </div>
      );
    }
    return filteredEntries;
  }

  return (
    <div className={cx(styles.main)} ref={containerRef}>
      <div className={cx(styles.topBarListing)}>
        <p className={cx(styles.titleList, "mt-3")}>{upperFirst(t("entry.list"))}</p>
        <EntriesResultRecap entries={editEntries} />
      </div>
      <div
        className={cx(styles.contentTitle, "mt-3")}
      >
        <ActivityEntriesActionTopBar 
          editEntries={editEntries}
          listSelection={listSelection}
          activityModelId={activityModel !== undefined ? activityModel?.id : undefined}
          view={"activity"}
        />
        <IfHasPerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
          {
            [CampaignStatus.IN_PREPARATION, CampaignStatus.IN_PROGRESS].indexOf(campaignStatus) !== -1 && (
              <button
                className={cx("button-1", styles.addEntryButton)}
                onClick={withReadOnlyAccessControl(onAddEntryClick)}
              >
                + {upperFirst(t("entry.add"))}
              </button>
            )
          }
        </IfHasPerimeterRole>
      </div>
      {editEntriesRendered()}
    </div>
  );
};

export default ActivityEntries;
