import { useSelector } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";

import { RootState } from "@reducers/index";

import sortScope from "@lib/core/scopes/sortScopes";
import memoValue from "@lib/utils/memoValue";

import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";
import selectFilteredEntriesOfMultipleCampaignsForAnalysis from "@selectors/activityEntries/selectFilteredEntriesOfMultipleCampaignsForAnalysis";
import selectCategoriesInCartographyForCampaign from "@selectors/cartography/selectCategoriesInCartographyForCampaign";
import selectCampaignsInfoByActivityModel from "@selectors/activityEntryInfoByCampaigns/selectCampaignsInfoByActivityModel";

import { SelectOne, Option } from "@components/helpers/ui/selects";

import styles from "@styles/dashboard/campaign/dashboardViews/comparisonDashboards/sub/activityselectOne.module.scss";

interface Props {
  campaignId: number;
  campaignToCompareId: number;
  selectedActivityModel: number | null;
  onChange: (selectedActivityModel: number) => void;
}

const ActivitySelectOne = ({
  campaignId,
  campaignToCompareId,
  selectedActivityModel,
  onChange,
}: Props) => {
  const campaignIdList = memoValue(
    [campaignId, campaignToCompareId].filter(id => !isNaN(id))
  );
  const entriesOfCampaigns = useSelector((state: RootState) =>
    selectActivityEntriesOfCampaignIdList(state, campaignIdList)
  );
  const filteredEntriesOfCampaigns = useSelector((state: RootState) =>
    selectFilteredEntriesOfMultipleCampaignsForAnalysis(
      state,
      entriesOfCampaigns
    )
  );
  const campaignsInfoByActivityModel = useSelector((state: RootState) =>
    selectCampaignsInfoByActivityModel(state, filteredEntriesOfCampaigns)
  );

  const categoriesInCartography = useSelector((state: RootState) =>
    selectCategoriesInCartographyForCampaign(state, campaignId)
  );
  const sortedCategories = Object.values(categoriesInCartography).sort(
    (catA, catB) => {
      return sortScope(catA.scope, catB.scope);
    }
  );
  const relevantCategories = sortedCategories.flatMap(category => {
    const relevantActivityModels = category.activityModels.filter(
      activitymodel => {
        const nbResultsInCampaign1 =
          campaignsInfoByActivityModel[campaignId]?.[activitymodel.id]?.nb ?? 0;
        const nbResultsInCampaign2 =
          campaignsInfoByActivityModel[campaignToCompareId]?.[activitymodel.id]
            ?.nb ?? 0;
        return nbResultsInCampaign1 > 0 || nbResultsInCampaign2 > 0;
      }
    );

    if (relevantActivityModels.length === 0) {
      return [];
    }
    return { ...category, activityModels: relevantActivityModels };
  });

  return (
    <div className={styles.activitySelectOneContainer}>
      {upperFirst(t("activity.activity"))}
      <SelectOne
        selected={selectedActivityModel}
        onOptionClick={onChange}
        className={styles.activitySelect}
      >
        {ctx => (
          <>
            {relevantCategories.flatMap(category => [
              <div className={styles.optionGroup}>{category.name}</div>,
              category.activityModels.map(activityModel => (
                <Option
                  {...ctx}
                  key={activityModel.id}
                  value={activityModel.id}
                  className={styles.option}
                >
                  {activityModel.name}
                </Option>
              )),
            ])}
            {relevantCategories.length === 0 && (
              <div className={styles.noData}>
                {upperFirst(t("dashboard.entryComparisonChart.noHistoryData"))}
              </div>
            )}
          </>
        )}
      </SelectOne>
    </div>
  );
};

export default ActivitySelectOne;
