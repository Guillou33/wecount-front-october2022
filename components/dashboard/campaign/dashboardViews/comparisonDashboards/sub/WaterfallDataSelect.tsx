import { useSelector } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";

import { RootState } from "@reducers/index";
import { WaterfallDataName } from "@hooks/core/waterfall/helpers/waterfallData";

import selectWaterfallData from "@selectors/waterfall/selectWaterfallData";
import selectActivityEntriesOfCampaignIdList from "@selectors/activityEntries/selectActivityEntriesOfCampaignIdList";

import { SelectOne, Option } from "@components/helpers/ui/selects";

import styles from "@styles/dashboard/campaign/dashboardViews/comparisonDashboards/sub/waterfallDataSelect.module.scss";

interface Props {
  campaignIds: [number, number];
  selected: WaterfallDataName | null;
  onChange: (value: WaterfallDataName | null) => void;
}

const WaterfallDataSelect = ({ campaignIds, selected, onChange }: Props) => {
  const [campaignIdOne] = campaignIds;
  const campaign1Year = useSelector(
    (state: RootState) =>
      state.campaign.campaigns[campaignIdOne]?.information?.year ?? 0
  );
  const entriesOfCampaigns = useSelector((state: RootState) =>
    selectActivityEntriesOfCampaignIdList(state, campaignIds)
  );
  const waterfallData = useSelector((state: RootState) =>
    selectWaterfallData(state, campaignIds, entriesOfCampaigns)
  );
  const usedWaterfallDataNames = Object.entries(waterfallData).flatMap(
    ([dataName, result]) => {
      if (result === 0) {
        return [];
      }
      return dataName as WaterfallDataName;
    }
  );
  return (
    <div className={styles.waterfallDataSelect}>
      {upperFirst(t("dashboard.waterfall.waterfallDataSelect.label"))} :
      <SelectOne
        selected={selected ?? "all"}
        onOptionClick={value => {
          onChange(value !== "all" ? value : null);
        }}
        className={styles.select}
      >
        {ctx => (
          <>
            <Option {...ctx} value={"all"}>
              {upperFirst(t("dashboard.waterfall.waterfallDataSelect.all"))}
            </Option>
            {usedWaterfallDataNames.map(name => (
              <Option {...ctx} key={name} value={name}>
                {upperFirst(
                  t(`dashboard.waterfall.axisLabels.${name}`, {
                    year: campaign1Year,
                  })
                )}
              </Option>
            ))}
          </>
        )}
      </SelectOne>
    </div>
  );
};

export default WaterfallDataSelect;
