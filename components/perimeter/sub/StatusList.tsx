import React from "react";
import cx from "classnames";
import styles from "@styles/perimeter/sub/perimeterCard.module.scss";

import { CampaignEmission } from "@reducers/perimeter/perimeterReducer";

import { CampaignStatus, nbrCampaignStatuses } from "@custom-types/core/CampaignStatus";

import CampaignDescription from "./CampaignDescription";

import { t } from "i18next";
import { upperFirst } from "lodash";

interface CampaignsDescription {
    [CampaignStatus.CLOSED]: boolean; 
    [CampaignStatus.ARCHIVED]: boolean; 
    [CampaignStatus.IN_PREPARATION]: boolean; 
    [CampaignStatus.IN_PROGRESS]: boolean; 
}

const StatusList = ({
    campaigns,
    nbrCampaignInStatuses
}: {
    campaigns: CampaignEmission[],
    nbrCampaignInStatuses: nbrCampaignStatuses
}) => {

    const [showCampaignsDescription, setShowCampaignsDescription] = React.useState<CampaignsDescription>({
        [CampaignStatus.CLOSED]: false, 
        [CampaignStatus.ARCHIVED]: false, 
        [CampaignStatus.IN_PREPARATION]: false, 
        [CampaignStatus.IN_PROGRESS]: false 
    })

    return (
        <ul className={cx(styles.statusList)}>
            <li className={cx(styles.status)}>
                <div className={cx(styles.statusTitle)}>
                    {upperFirst(t("campaign.status.inProgress"))} : {nbrCampaignInStatuses[CampaignStatus.IN_PROGRESS]}
                    {campaigns.filter(campaign => campaign.status === CampaignStatus.IN_PROGRESS).length > 0 && 
                        <p 
                            className={cx(styles.seeCampaigns)} 
                            onClick={() => setShowCampaignsDescription({
                                ...showCampaignsDescription, 
                                [CampaignStatus.IN_PROGRESS]: !showCampaignsDescription[CampaignStatus.IN_PROGRESS]
                            })}
                        >
                            {showCampaignsDescription[CampaignStatus.IN_PROGRESS] ? upperFirst(t("global.hide")) : upperFirst(t("global.see"))}
                        </p>
                    }
                </div>
                {showCampaignsDescription[CampaignStatus.IN_PROGRESS] &&
                    <ul>
                        {campaigns.filter(campaign => campaign.status === CampaignStatus.IN_PROGRESS).map(campaign => 
                            <CampaignDescription 
                                key={campaign.id}
                                campaign={campaign}
                            />
                        )}
                    </ul>
                }
            </li>
           <li className={cx(styles.status)}>
                <div className={cx(styles.statusTitle)}>
                    {upperFirst(t("campaign.status.inPreparation"))} : {nbrCampaignInStatuses[CampaignStatus.IN_PREPARATION]}
                    {campaigns.filter(campaign => campaign.status === CampaignStatus.IN_PREPARATION).length > 0 && 
                        <p 
                            className={cx(styles.seeCampaigns)} 
                            onClick={() => setShowCampaignsDescription({
                                ...showCampaignsDescription, 
                                [CampaignStatus.IN_PREPARATION]: !showCampaignsDescription[CampaignStatus.IN_PREPARATION]
                            })}
                        >
                            {showCampaignsDescription[CampaignStatus.IN_PREPARATION] ? upperFirst(t("global.hide")) : upperFirst(t("global.see"))}
                        </p>
                    }
                </div>
                {showCampaignsDescription[CampaignStatus.IN_PREPARATION] &&
                    <ul>
                        {campaigns.filter(campaign => campaign.status === CampaignStatus.IN_PREPARATION).map(campaign => 
                            <CampaignDescription 
                                key={campaign.id}
                                campaign={campaign}
                            />
                        )}
                    </ul>
                }
            </li>
            <li className={cx(styles.status)}>
                <div className={cx(styles.statusTitle)}>
                    {upperFirst(t("campaign.status.closed"))} : {nbrCampaignInStatuses[CampaignStatus.CLOSED]}
                    {campaigns.filter(campaign => campaign.status === CampaignStatus.CLOSED).length > 0 && 
                        <p 
                            className={cx(styles.seeCampaigns)} 
                            onClick={() => setShowCampaignsDescription({
                                ...showCampaignsDescription, 
                                [CampaignStatus.CLOSED]: !showCampaignsDescription[CampaignStatus.CLOSED]
                            })}
                        >
                                {showCampaignsDescription[CampaignStatus.CLOSED] ? upperFirst(t("global.hide")) : upperFirst(t("global.see"))}
                        </p>
                    }
                </div>
                {showCampaignsDescription[CampaignStatus.CLOSED] &&
                    <ul>
                        {campaigns.filter(campaign => campaign.status === CampaignStatus.CLOSED).map(campaign => 
                            <CampaignDescription 
                                key={campaign.id}
                                campaign={campaign}
                            />
                        )}
                    </ul>
                }
            </li>
            <li className={cx(styles.status)}>
                <div className={cx(styles.statusTitle)}>
                    {upperFirst(t("campaign.status.archived"))} : {nbrCampaignInStatuses[CampaignStatus.ARCHIVED]}
                    {campaigns.filter(campaign => campaign.status === CampaignStatus.ARCHIVED).length > 0 && 
                        <p 
                            className={cx(styles.seeCampaigns)} 
                            onClick={() => setShowCampaignsDescription({
                                ...showCampaignsDescription, 
                                [CampaignStatus.ARCHIVED]: !showCampaignsDescription[CampaignStatus.ARCHIVED]
                            })}
                        >
                            {showCampaignsDescription[CampaignStatus.ARCHIVED] ? upperFirst(t("global.hide")) : upperFirst(t("global.see"))}
                        </p>
                    }
                </div>
                {showCampaignsDescription[CampaignStatus.ARCHIVED] &&
                    <ul>
                        {campaigns.filter(campaign => campaign.status === CampaignStatus.ARCHIVED).map(campaign => 
                            <CampaignDescription 
                                key={campaign.id}
                                campaign={campaign}
                            />
                        )}
                    </ul>
                }
            </li>
        </ul>
    )
};

export default StatusList;