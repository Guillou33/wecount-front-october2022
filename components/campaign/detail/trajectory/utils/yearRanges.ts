import { CampaignInformation } from "@reducers/campaignReducer";
import { TrajectorySettings } from "@reducers/trajectory/trajectorySettings/trajectorySettingsReducer";
import { t } from "i18next";

export function getYearRange(
    campaign: CampaignInformation | undefined,
    trajectorySettings: TrajectorySettings
): number | null {
    if (campaign?.year == null || trajectorySettings.targetYear == null) {
        return null;
    }
    return trajectorySettings.targetYear - campaign.year;
}

export function getYearRangeErrorMessage(
    campaign: CampaignInformation | undefined,
    trajectorySettings: TrajectorySettings
): string {
    const { year } = campaign ?? {};
    const messages = [
        year ?? t("campaign.referenceYear"),
        trajectorySettings.targetYear ?? t("campaign.targetYear"),
    ];
    return messages.filter(value => typeof value === "string").join(` ${t("global.other.and")} `);
}