import React from "react";
import { useSelector } from "react-redux";
import cx from "classnames";
import styles from "@styles/perimeter/sub/perimeterCard.module.scss";
import { RootState } from "@reducers/index";

import { CampaignEmission, ScopeEmissions } from "@reducers/perimeter/perimeterReducer";

import { getCampaignTypeName } from "@lib/core/campaign/getCampaignTypeName";

import { t } from "i18next";
import { Scope } from "@custom-types/wecount-api/activity";

const getPlural = (data: number) => {
    return data > 1 ? t("global.data.data.plural") : t("global.data.data.singular");
}

const getNbrEntriesInCampaign = (scopes: ScopeEmissions | undefined): number => {
    if(scopes === undefined) return 0;

    const nbrEntries = 
        scopes[Scope.UPSTREAM].nbrEntriesExcluded +
        scopes[Scope.UPSTREAM].nbrEntriesIncluded +
        scopes[Scope.CORE].nbrEntriesExcluded +
        scopes[Scope.CORE].nbrEntriesIncluded +
        scopes[Scope.DOWNSTREAM].nbrEntriesExcluded +
        scopes[Scope.DOWNSTREAM].nbrEntriesIncluded;
    return nbrEntries;
}

const CampaignDescription = ({
    campaign
}: {
    campaign: CampaignEmission
}) => {
    const scopes = useSelector<RootState, ScopeEmissions | undefined>(
        state => state.perimeter.emissions[campaign.perimeterId] === undefined ?
            undefined : 
            state.perimeter.emissions[campaign.perimeterId].campaigns[campaign.id] === undefined ? 
                undefined :
                state.perimeter.emissions[campaign.perimeterId].campaigns[campaign.id].scopes
    );

    const entriesInCampaign = getNbrEntriesInCampaign(scopes);

    return (
        <li className={cx(styles.campaignsDescription)}>
            <p style={{width: "auto"}}>{campaign.name} -{" "}{getCampaignTypeName(campaign.type)} -{" "}{campaign.year} -{" "}{entriesInCampaign} {getPlural(entriesInCampaign)}</p>
        </li>
    );
}

export default CampaignDescription;