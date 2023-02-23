import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import cx from "classnames";
import Truncate from "react-truncate";
import Link from "next/link";
import { useRouter } from "next/router";

import { SubMenu } from "@reducers/mainMenu/mainMenuReducer";
import useSubMenuState from "@hooks/core/mainMenu/useSubMenuState";
import { openSubMenu } from "@actions/mainMenu/mainMenuActions";

import { RootState } from "@reducers/index";
import { CampaignState } from "@reducers/campaignReducer";
import Foldable from "@components/helpers/form/Foldable";

import styles from "@styles/layout/sub/featureMenu.module.scss";

export interface Props {
  title: string;
  basePath: string;
  icon: JSX.Element;
  subMenu: SubMenu;
  beforeLinks?: JSX.Element | string;
  afterLinks?: JSX.Element;
}

const FeatureMenu = ({
  title,
  icon,
  basePath,
  subMenu,
  beforeLinks,
  afterLinks,
}: Props) => {
  const dispatch = useDispatch();
  const campaign = useSelector<RootState, CampaignState>(
    state => state.campaign
  );
  const router = useRouter();
  const isActive = router.pathname.startsWith(`/${basePath}`);

  const [isOpened, toggle] = useSubMenuState(subMenu);

  useEffect(() => {
    if (isActive) {
      dispatch(openSubMenu(subMenu));
    }
  }, [isActive, subMenu]);

  const campaignLinks = Object.values(campaign.campaigns).map(campaign => {
    if (!campaign.information) return null;
    const path = `/${basePath}/${campaign.information.id}`;
    return (
      <Link key={campaign.information.id} href={path}>
        <div
          className={cx(styles.subMenuItem, {
            [styles.active]: router.asPath === path,
          })}
        >
          <p className={cx(styles.subMenuText)}>
            <Truncate>{campaign.information.name}</Truncate>
          </p>
          <i className={cx("fas fa-circle", styles.activeMarker)}></i>
        </div>
      </Link>
    );
  });

  function getMenuHref(): string {
    if (campaign.currentCampaign) {
      return `/${basePath}/${campaign.currentCampaign}`;
    }
    const campaigns = Object.values(campaign.campaigns);
    if (campaigns.length > 0 && campaigns[0].information) {
      return `/${basePath}/${campaigns[0].information.id}`;
    }
    return "";
  }

  return (
    <div
      className={cx(styles.menuItem, {
        [styles.active]: isActive,
      })}
    >
      <div className={cx(styles.iconContainer)}>{icon}</div>
    </div>
  );
};

export default FeatureMenu;
