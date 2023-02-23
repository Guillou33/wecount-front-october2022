import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import cx from "classnames";
import styles from "@styles/campaign/detail/campaignsDropdown.module.scss";
import { BsCaretDownFill } from "react-icons/bs";
import Dropdown from "@components/helpers/ui/dropdown/Dropdown";
import Truncate from "react-truncate";
import Link from "next/link";
import { useRouter } from "next/router";

import { RootState } from "@reducers/index";
import { CampaignState } from "@reducers/campaignReducer";
import { PerimeterRole } from '@custom-types/wecount-api/auth';
import IfHasPerimeterRole from "@components/auth/access-control/IfHasPerimeterRole";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import { canAccessCampaign } from "@lib/core/campaign/canAccessCampaign";
import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
    basePath: string;
    campaignName: string | undefined;
}

const CampaignsDropdown = ({ basePath, campaignName }: Props) => {
    const isManager = useUserHasPerimeterRole(PerimeterRole.PERIMETER_MANAGER);
    const isCollaborator = useUserHasPerimeterRole(PerimeterRole.PERIMETER_COLLABORATOR);
    const campaign = useSelector<RootState, CampaignState>(
        state => state.campaign
    );
    const availableCampaigns = Object.values(campaign.campaigns).filter(campaign => campaign.information?.status && campaign.information?.status !== CampaignStatus.ARCHIVED);
    const roleFilteredCampaigns = availableCampaigns.filter(campaign => {
      return canAccessCampaign(campaign, {
        [PerimeterRole.PERIMETER_MANAGER]: isManager,
        [PerimeterRole.PERIMETER_COLLABORATOR]: isCollaborator,
      });
    });
    let fromActivities = false;
    if (basePath === "campaignActivities") {
        basePath = "campaigns";
        fromActivities = true;
    }
    const router = useRouter();

    const campaignLinks = roleFilteredCampaigns.map(campaign => {
        if (!campaign.information) return null;
        const path = `/${basePath}/${campaign.information.id}`;

        return (
            <Dropdown.Item key={campaign.information.id} className={cx(styles.campaignItemWrapper, {
                [styles.active]: router.asPath === path,
            })}>
                <div className={cx(styles.campaignItem)}>
                    <Link href={path}>
                        <div className={cx(styles.subMenuItem, {
                            [styles.active]: router.asPath === path,
                        })}
                        >
                            <p className={cx(styles.subMenuText)}>
                                <Truncate>{campaign.information.name}</Truncate>
                            </p>
                        </div>
                    </Link>
                </div>
            </Dropdown.Item>
        );
    });

    return (
        <div className={cx(styles.dropdownCampaignsDropdown)}>
            <Dropdown
                togglerContent={
                    <div style={{ display: "flex", flexDirection: "row" }}>
                        {!fromActivities && (
                            <h3 className={styles.campaignName}>
                                {campaignName}
                            </h3>
                        )}
                        <div style={{ padding: "10px 6px" }}>
                            <BsCaretDownFill size="10" color="#7d88ca" />
                        </div>
                    </div>
                }
            >
                {campaignLinks}

                <IfHasPerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
                    <Dropdown.Item className={cx(styles.campaignItemWrapper)}>
                        <Link href="/userSettings/campaigns">
                            <p style={{ textDecoration: "underline", color: "#4654ac" }}>{upperFirst(t("campaign.allMyCampaigns"))}</p>
                        </Link>
                    </Dropdown.Item>
                </IfHasPerimeterRole>
            </Dropdown>
        </div>
    );
}

export default CampaignsDropdown;