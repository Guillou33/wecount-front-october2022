import styles from "@styles/layout/authLayout.module.scss";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import cx from "classnames";

import Link from "next/link";
import { useClickOutside } from "@hooks/utils/useClickOutside";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { ProfileState } from "@reducers/profileReducer";
import { CampaignState } from "@reducers/campaignReducer";
import { Role, PerimeterRole } from "@custom-types/wecount-api/auth";
import useSetOnceAuthUtils from "@hooks/core/useSetOnceAuthUtils";
import useSetOnceCampaignUtils from "@hooks/core/useSetOnceCampaignUtils";

import BurgerMenuIcon from "@components/helpers/mobile/BurgerMenuIcon";
import ClassicModal from "@components/helpers/modal/ClassicModal";

import { FiMail, FiSettings, FiClipboard, FiTrendingDown, FiBarChart, FiHelpCircle } from "react-icons/fi";

import { hideReadOnlyModeFeedbackPopup } from "@actions/readOnlyMode/readOnlyModeActions";
import { setCurrentCampaign } from "@actions/campaign/campaignActions";
import useSetOnceAllPerimeters from "@hooks/core/reduxSetOnce/useSetOnceAllPerimeters";
import PerimeterSwitcher from "@components/layout/sub/PerimeterSwitcher";
import IfHasPerimeterRole from "@components/auth/access-control/IfHasPerimeterRole";

import { endEdit } from "@actions/activity/edit/editActions";
import { sendHelpInfo, sendViewCampaign } from "@actions/analytics/analyticsActions";
import { analyticEvents, CampaignEventType, EventType, HelpEventType } from "@custom-types/core/AnalyticEvents";
import { t } from "i18next";
import { upperFirst } from "lodash";
import useSetPerimetersEmissions from "@hooks/core/useSetPerimetersEmissions";

const AuthLayout = (props: { children?: any }) => {
  useSetOnceAuthUtils();
  useSetOnceCampaignUtils();
  useSetOnceAllPerimeters();

  const dispatch = useDispatch();

  const showReadOnlyModeFeedback = useSelector<RootState, boolean>(
    state => state.readOnlyMode.showPopup
  );

  const router = useRouter();

  const isActive = (basePath: string) => router.pathname.startsWith(`/${basePath}`);

  const campaign = useSelector<RootState, CampaignState>(
    state => state.campaign
  );

  const campaignId = useSelector<RootState, number>(
    // Set in getInitialProps
    state => state.campaign.currentCampaign!
  );

  const profile = useSelector<RootState, ProfileState>(state => state.profile);
  const roles = useSelector<RootState, Role[]>(state => state.auth.roles);
  const isInReadOnlyMode = profile.company?.readonlyMode ?? false;

  const [menuMobileOpen, setMenuMobileOpen] = useState(false);
  const [menuProfileOpen, setMenuProfileOpen] = useState(false);
  const onClickOutsideMenu = () => {
    if (menuProfileOpen) {
      setMenuProfileOpen(false);
    }
  };
  const onClickOutsideMenuMobile = () => {
    if (menuMobileOpen) {
      setMenuMobileOpen(false);
    }
  };
  const [refMenu, refProfilePic] = useClickOutside(onClickOutsideMenu);
  const [refMenuMobile, refBurgerButton] = useClickOutside(onClickOutsideMenuMobile);

  const campaignIdFromUrl = router.query.campaignId
    ? Number(router.query.campaignId as string)
    : null;

  useEffect(() => {
    if (campaignIdFromUrl != null) {
      dispatch(setCurrentCampaign({ campaignId: campaignIdFromUrl }));
    }
  }, [campaignIdFromUrl]);

  const renderMenuLink = (name: string, path: string, as?: string) => {
    return (
      <Link href={path} as={as}>
        <p
          className={cx(styles.linkName, {
            [styles.active]: router.pathname === path,
          })}
        >
          {name}
        </p>
      </Link>
    );
  };

  const renderMobileMenuLink = (name: string, path: string, as?: string) => {
    return (
      <Link href={path} as={as}>
        <p
          className={cx(styles.linkName, {
            [styles.active]: router.pathname === path,
          })}
        >
          {name}
        </p>
      </Link>
    );
  };

  return (
    <>
      <div
        ref={refMenuMobile}
        className={cx(styles.mobileMenu, { [styles.open]: menuMobileOpen })}
      >
        <div className={cx(styles.menuItems)}>
          {/* {renderMobileMenuLink("Campagnes", "/campaigns")} */}
          {roles.indexOf(Role.ROLE_ADMIN) === -1 &&
            renderMobileMenuLink(
              `${upperFirst(t("user.role.title.admin"))} - ${upperFirst(t("dashboard.dashboard"))}`,
              "/admin/dashboard/company-list"
            )}
          {roles.indexOf(Role.ROLE_ADMIN) !== -1 &&
            renderMobileMenuLink(
              `${upperFirst(t("user.role.title.admin"))} - ${upperFirst(t("user.account.new.new"))}`,
              "/admin/new-account"
            )}
          {(roles.indexOf(Role.ROLE_ADMIN) !== -1 ||
            roles.indexOf(Role.ROLE_CONSULTANT) !== -1) &&
            renderMobileMenuLink(`${upperFirst(t("user.role.title.admin"))} - ${upperFirst(t("user.account.connection"))}`, "/admin/impersonate")}
          {
            renderMobileMenuLink(
              upperFirst(t("user.account.myAccount")),
              "/account/language"
            )
          }
          {renderMobileMenuLink(`${upperFirst(t("user.account.logout"))}`, "/logout")}
        </div>
      </div>
      <div className={cx(styles.profilePicContainer)}>
        <div
          ref={refProfilePic}
          onClick={() => setMenuProfileOpen(!menuProfileOpen)}
          className={cx(styles.picContainer)}
        >
          <img src="/images/default-avatar.png" />
          <i className={cx("fas fa-chevron-down", styles.chevron)}></i>
        </div>
        {!menuProfileOpen ? null : (
          <div ref={refMenu} className={cx(styles.menu)}>
            <div className={cx(styles.menuItem)}>
              {roles.indexOf(Role.ROLE_ADMIN) !== -1 &&
                renderMenuLink(
                  `${upperFirst(t("user.role.title.admin"))} - ${upperFirst(t("dashboard.dashboard"))}`,
                  "/admin/dashboard/company-list"
                )}
              {roles.indexOf(Role.ROLE_ADMIN) !== -1 &&
                renderMenuLink(`${upperFirst(t("user.role.title.admin"))} - ${upperFirst(t("user.account.new.new"))}`, "/admin/new-account")}
              {(roles.indexOf(Role.ROLE_ADMIN) !== -1 ||
                roles.indexOf(Role.ROLE_CONSULTANT) !== -1) &&
                renderMenuLink(`${upperFirst(t("user.role.title.admin"))} - ${upperFirst(t("user.account.connection"))}`, "/admin/impersonate")}
              {
                renderMenuLink(
                  upperFirst(t("user.account.myAccount")),
                  "/account/language"
                )
              }
              {renderMenuLink(`${upperFirst(t("user.account.logout"))}`, "/logout")}
            </div>
          </div>
        )}
      </div>
      <div className={styles.contentContainer}>
        <div className={styles.leftMenu}>
          <div className={cx(styles.logoContainer)}>
            {profile.company?.logoUrl ? (
              <img
                src={profile.company?.logoUrl}
                alt={profile.company?.name}
                className={cx(styles.logoCompany)}
              />
            ) : (
              <div style={{
                width: 60,
                height: 60,
                marginLeft: -10,
              }}></div>
            )}
          </div>
          <div className={cx(styles.companyName)}>
            <PerimeterSwitcher />
          </div>
          {isInReadOnlyMode && (
            <>
              <p className={cx(styles.readonlyWarning, "alert")}>
                {upperFirst(t("warning.readonly.part1"))}. {upperFirst(t("warning.readonly.part2"))}{" "}
                <a
                  href="mailto:support@wecount.io"
                  className={styles.supportLink}
                >
                  {upperFirst(t("global.other.here"))}
                </a>
              </p>
              <i className={cx(styles.readOnlyWarningSmall)}>
                <img src="/icons/read-only.png" />
              </i>
            </>
          )}
          <div className={cx(styles.menuContainer)}>
            {/* <CampaignCartographyMenu /> */}
            <div className={cx(styles.linkMenu)}>
              <Link href={`/campaigns/${campaignId ?? Object.keys(campaign.campaigns)[0]}`}>
                <div style={{ display: "flex", flexDirection: "row" }} onClick={() => {
                  dispatch(endEdit());
                }}>
                  <div className={cx(styles.iconContainer)}>
                    <FiClipboard size="20" color={isActive("campaigns") ? "#5ef1d5" : "white"} />
                  </div>
                  <p className={cx(styles.titleLink)} style={{ color: isActive("campaigns") ? "#5ef1d5" : "white" }}>
                    {upperFirst(t("campaign.myCampaigns"))}
                  </p>
                </div>
              </Link>
            </div>
            <IfHasPerimeterRole role={PerimeterRole.PERIMETER_COLLABORATOR}>
              {/* <DashboardMenu /> */}
              <div className={cx(styles.linkMenu)}>
                <Link href={`/dashboards/${campaignId ?? Object.keys(campaign.campaigns)[0]}`}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div className={cx(styles.iconContainer)}>
                      <FiBarChart size="20" color={isActive("dashboards") ? "#5ef1d5" : "white"} />
                    </div>
                    <p className={cx(styles.titleLink)} style={{ color: isActive("dashboards") ? "#5ef1d5" : "white" }}>
                      {upperFirst(t("dashboard.analysis"))}
                    </p>
                  </div>
                </Link>
              </div>
              {/* <TrajectoryMenu /> */}
              <div className={cx(styles.linkMenu)}>
                <Link href={`/trajectories/${campaignId ?? Object.keys(campaign.campaigns)[0]}`}>
                  <div style={{ display: "flex", flexDirection: "row" }}>
                    <div className={cx(styles.iconContainer)}>
                      <FiTrendingDown size="20" color={isActive("trajectories") ? "#5ef1d5" : "white"} />
                    </div>
                    <p className={cx(styles.titleLink)} style={{ color: isActive("trajectories") ? "#5ef1d5" : "white" }}>
                      {upperFirst(t("trajectory.trajectory"))}
                    </p>
                  </div>
                </Link>
              </div>
            </IfHasPerimeterRole>
            <div className={cx(styles.linkMenu)}>
              <a
                href="mailto:support@wecount.io"
                className={styles.supportLink}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <div className={cx(styles.iconContainer)}>
                    <FiMail size="20" style={{ color: "white" }} />
                  </div>
                  {/* <div className={cx(styles.menuTextContainer)}>
                    <p>Support</p>
                  </div> */}
                  <p className={cx(styles.titleLink)} style={{ color: "white" }}>
                    {upperFirst(t("support.support"))}
                  </p>
                </div>
              </a>
            </div>
            <IfHasPerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
              <div className={cx(styles.linkMenu)}>
                <Link href={`/userSettings/sites`}>
                  <div style={{ display: "flex", flexDirection: "row" }}>

                    <FiSettings size="20" color={isActive("userSettings") ? "#5ef1d5" : "white"} />

                    <p className={cx(styles.titleLink)} style={{ color: isActive("userSettings") ? "#5ef1d5" : "white" }}>
                      {upperFirst(t("settings.settings"))}
                    </p>
                  </div>
                </Link>
              </div>
            </IfHasPerimeterRole>
            <div className={cx(styles.linkMenu)}>
              <a
                rel="noopener noreferrer"
                target="_blank"
                style={{ textDecoration: "none" }}
                href="https://wecount.notion.site/Bienvenue-sur-la-base-de-connaissances-WeCount-d4aba215ab0f4621addf0ac361274d68"
                onClick={() => dispatch(sendHelpInfo({ eventName: analyticEvents[EventType.HELP][HelpEventType.NAVBAR], campaignId }))}
              >
                <div style={{ display: "flex", flexDirection: "row" }}>
                  <FiHelpCircle size="20" color={"white"} />
                  <p className={cx(styles.titleLink)} style={{ color: "white" }}>
                    {upperFirst(t("help.help"))}
                  </p>
                </div>
              </a>
            </div>
          </div>
          {/* Special cgu for leem users */}
          {profile.company?.id === 83 && (
            <a
              href="https://www.notion.so/wecount/Mentions-l-gales-40933ee33197471383f56ee204f332f3"
              target="_blank"
              className={styles.cguLink}
            >
              {upperFirst(t("global.legalNotice"))}
            </a>
          )}
          <div className={cx(styles.logoContainer)}>
            <img
              src="/images/wecount-logo-cut.png"
              srcSet="/images/wecount-logo-cut.png 2x"
              alt="WeCount"
              className={styles.logo}
            />
          </div>
        </div>
        <div className={styles.rightContent}>
          <div
            className={cx(styles.main, {
              [styles.openedMobileMenu]: menuMobileOpen,
            })}
          >
            <BurgerMenuIcon
              ref={refBurgerButton}
              width={30}
              height={20}
              strokeWidth={3}
              colorClosed={"#1b2668"}
              colorOpen={"white"}
              onClick={() => setMenuMobileOpen(!menuMobileOpen)}
              className={styles.burgerMenuIcon}
              open={menuMobileOpen}
            />
            {props.children}
          </div>
        </div>
        <ClassicModal
          open={showReadOnlyModeFeedback}
          onClose={() => dispatch(hideReadOnlyModeFeedbackPopup())}
          small
          contentClassName={cx(styles.readOnlyFeedbackPopup, "alert")}
        >
          <p className={styles.readonlyWarning}>
              {upperFirst(t("warning.readonly.part1"))}. {upperFirst(t("warning.readonly.part2"))}{" "}
              <a
                href="mailto:support@wecount.io"
                className={styles.supportLink}
              >
                {upperFirst(t("global.other.here"))}
              </a>
          </p>
        </ClassicModal>
      </div>
    </>
  );
};

export default AuthLayout;
