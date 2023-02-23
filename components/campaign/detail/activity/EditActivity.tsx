import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { RootState } from "@reducers/index";
import { ActivityEditState } from "@reducers/activity/editReducer";
import { CustomThunkDispatch } from "@custom-types/redux";
import styles from "@styles/campaign/detail/activity/editActivity.module.scss";
import EditActivityHeader, {
  View,
} from "@components/campaign/detail/activity/sub/EditActivityHeader";
import ActivityEntries from "@components/campaign/detail/activity/sub/activity-entries/ActivityEntries";
import useSetOnceUsers from "@hooks/core/reduxSetOnce/useSetOnceUsers";
import useDisableBodyScroll from "@hooks/utils/useDisableBodyScroll";

import FilterBar from "./sub/activity-entries/FilterBar";
import RightModal from "@components/helpers/modal/RightModal";
import FilterModale from "@components/filters/FilterModale";
import SiteFilter from "@components/filters/filterInputs/SiteFilter";
import ProductFilter from "@components/filters/filterInputs/ProductFilter";
import StatusFilter from "@components/filters/filterInputs/StatusFilter";
import EmissionFactorsFilter from "@components/filters/filterInputs/EmissionFactorsFilter";
import { FilterNames } from "@reducers/filters/filtersReducer";
import UserFilter from "@components/filters/filterInputs/UserFilter";
import EntryTagFilter from "@components/filters/filterInputs/EntryTagFilter";
import ActivityHistory from "@components/campaign/detail/activity/sub/history/ActivityHistory";

import { closeModaleAndTimeoutEndEdit } from "@actions/activity/edit/editActions";
import FilterExcluded from "@components/filters/filterInputs/FilterExcluded";
import EmissionFactorChooserModal from "@components/core/emissionFactor/emissionFactorChooserModal/EmissionFactorChooserModal";
import { setModalOpen } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";

const EditActivity = () => {
  useSetOnceUsers();
  const router = useRouter();

  const dispatch = useDispatch() as CustomThunkDispatch;

  const emissionFactorModalOpen = useSelector<RootState, boolean>(state => state.emissionFactorChoice.modalOpen);

  const activityEdit = useSelector<RootState, ActivityEditState>(
    state => state.activity.edit
  );

  const campaignId = useSelector<RootState, number>(
    // Set in getInitialProps
    state => state.campaign.currentCampaign!
  );

  const listSelection = useSelector<RootState, Array<number>>(
    state => state.listSelectedEntries.selectedEntries
  );

  const [currentView, setCurrentView] = useState<View>("ENTRIES");
  const [filtersOpened, setFiltersOpened] = useState(false);

  useDisableBodyScroll();

  useEffect(() => {
    router.push(router.asPath + "#");
  }, []);

  useEffect(() => {
    const closeModale = () => {
      dispatch(closeModaleAndTimeoutEndEdit());
    };

    window.addEventListener("popstate", closeModale);

    return () => window.removeEventListener("popstate", closeModale);
  }, []);

  return (
    <div className={styles.editActivity} id="activity-modale">
      {activityEdit?.activityModelId != null && (
        <EditActivityHeader
          currentView={currentView}
          setView={setCurrentView}
          activityModelId={activityEdit.activityModelId}
        />
      )}
      <FilterBar setOpen={setFiltersOpened} />
      <div className={cx("page-content-wrapper", styles.activityPageWrapper)}>
        <div className={cx(styles.editActivityContent, "page-content")}>
          {currentView === "ENTRIES" && <ActivityEntries />}
          {currentView === "HISTORY" && <ActivityHistory />}
        </div>
      </div>
      <RightModal open={filtersOpened} onClose={() => setFiltersOpened(false)}>
        <FilterModale onClose={() => setFiltersOpened(false)}>
          <FilterExcluded />
          <SiteFilter filterName={FilterNames.CARTOGRAPHY_SITES} />
          <ProductFilter filterName={FilterNames.CARTOGRAPHY_PRODUCTS} />
          <UserFilter filterName={FilterNames.CARTOGRAPHY_OWNER} kind="owner" />
          <UserFilter
            filterName={FilterNames.CARTOGRAPHY_WRITER}
            kind="writer"
          />
          <StatusFilter filterName={FilterNames.CARTOGRAPHY_STATUSES} />
          <EmissionFactorsFilter
            filterName={FilterNames.CARTOGRAPHY_EMISSION_FACTORS}
            campaignId={campaignId}
          />
          <EntryTagFilter filterName={FilterNames.CARTOGRAPHY_ENTRY_TAGS} />
        </FilterModale>
      </RightModal>
      <RightModal open={emissionFactorModalOpen} onClose={() => dispatch(setModalOpen(false))}>
        <EmissionFactorChooserModal onClose={() => dispatch(setModalOpen(false))} />
      </RightModal>
    </div>
  );
};

export default EditActivity;
