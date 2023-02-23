import AuthLayout from "@components/layout/AuthLayout";
import Error404 from "@components/error/Error404";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  endEdit,
  closeModaleAndTimeoutEndEdit,
} from "@actions/activity/edit/editActions";
import { RootState } from "@reducers/index";
import { ActivityEditState } from "@reducers/activity/editReducer";
import { Campaign as CampaignType } from "@reducers/campaignReducer";
import EditActivity from "@components/campaign/detail/activity/EditActivity";
import _, { upperFirst } from "lodash";
import MainHeader from "@components/core/MainHeader";

import useSetAllEntries from "@hooks/core/reduxSetOnce/useSetAllEntries";
import useSetOnceUsers from "@hooks/core/reduxSetOnce/useSetOnceUsers";
import useSetOnceActivityCategoriesPreferences from "@hooks/core/reduxSetOnce/useSetOnceActivityCategoriesPreferences";

import useIsInReadOnlyMode from "@hooks/core/readOnlyMode/useIsInReadOnlyMode";

import CartographyView from "./dashboard/CartographyView";
import ListingView from "./listing/ListingView";
import FullPageModale from "@components/helpers/modal/FullPageModale";
import { canAccessCampaign } from "@lib/core/campaign/canAccessCampaign";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import { t } from "i18next";
import SitesView from "./sites/SitesView";
import useSetOnceSites from "@hooks/core/reduxSetOnce/useSetOnceSites";
import { SiteEditState } from "@reducers/core/siteReducer";
import { closeSiteModaleAndTimeoutEndEdit, endSiteEdit } from "@actions/core/site/siteActions";
import SiteView from "./sites/SitesViewNavigation/SiteView";
import UsersView from "./users/UsersView";

enum CurrentView {
  DASHBOARD,
  LISTING,
  SITES,
  USERS
}

const Campaign = () => {
  const isInReadOnlyMode = useIsInReadOnlyMode();
  const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);
  const isCollaborator = useUserHasPerimeterRole(PerimeterRole.PERIMETER_COLLABORATOR);

  const availableTabs = [
    {
      label: t("cartography.cartography").toUpperCase(),
      value: CurrentView.DASHBOARD,
    },
  ];

  if (!isInReadOnlyMode) {
    availableTabs.push({
      label: t("cartography.list").toUpperCase(),
      value: CurrentView.LISTING,
    });
  }

  if (!isInReadOnlyMode) {
    availableTabs.push({
      label: t("site.sites").toUpperCase(),
      value: CurrentView.SITES,
    });
  }

  if (!isInReadOnlyMode) {
    availableTabs.push({
      label: t("user.users").toUpperCase(),
      value: CurrentView.USERS,
    });
  }

  useEffect(() => {
    return () => {
      dispatch(endEdit());
      dispatch(endSiteEdit());
    };
  }, []);

  const campaignId = useSelector<RootState, number>(
    // Set in getInitialProps
    state => state.campaign.currentCampaign!
  );
  const campaign = useSelector<RootState, CampaignType | undefined>(
    state => state.campaign.campaigns[campaignId]
  );
  useSetAllEntries(campaignId);
  useSetOnceUsers();
  useSetOnceSites();
  useSetOnceActivityCategoriesPreferences();

  const activityEdit = useSelector<RootState, ActivityEditState>(
    state => state.activity.edit
  );
  const siteEdit = useSelector<RootState, SiteEditState>(
    state => state.core.site.siteEdit
  );
  const dispatch = useDispatch();

  const [currentView, setCurrentView] = useState(CurrentView.DASHBOARD);

  const renderContent = () => {
    switch (currentView) {
      case CurrentView.DASHBOARD:
        return <CartographyView campaignId={campaignId} />;

      case CurrentView.LISTING:
        return <ListingView campaignId={campaignId} />;
      
      case CurrentView.SITES:
        return <SitesView campaignId={campaignId} />;

      case CurrentView.USERS:
        return <UsersView campaignId={campaignId} />;

      default:
        return <ListingView campaignId={campaignId} />;
    }
  };

  if (campaign?.unfound) {
    return <Error404 />;
  }

  if (campaign && !canAccessCampaign(campaign, {
    [PerimeterRole.PERIMETER_MANAGER]: isManager,
    [PerimeterRole.PERIMETER_COLLABORATOR]: isCollaborator,
  })) {
    return <Error404 />;
  }

  return (
    <AuthLayout>
      <MainHeader
        title={upperFirst(t("campaign.myCampaigns"))}
        menu={"campaigns"}
        campaign={campaign}
        availableTabs={availableTabs}
        currentView={currentView}
        onChange={setCurrentView}
        currentTrajectory={null}
      />
      <div className="page-content-wrapper">{renderContent()}</div>
      <FullPageModale
        onClose={() => {
          dispatch(closeModaleAndTimeoutEndEdit());
        }}
        open={activityEdit.isEditing && activityEdit.isModalOpened}
      >
        <EditActivity />
      </FullPageModale>
      <FullPageModale
        onClose={() => {
          dispatch(closeSiteModaleAndTimeoutEndEdit());
        }}
        open={siteEdit.isEditing && siteEdit.isModalOpened}
      >
        <SiteView />
      </FullPageModale>
    </AuthLayout>
  );
};

export default Campaign;
