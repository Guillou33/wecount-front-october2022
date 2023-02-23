import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { useSelector } from "react-redux";
import { uniqueId, upperFirst } from "lodash";

import { RootState } from "@reducers/index";
import { Scope } from "@custom-types/wecount-api/activity";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import { convertToTons, percentageCalculator } from "@lib/utils/calculator";
import {
  chartBySitesOptions,
  DataChunk,
} from "@components/dashboard/campaign/sub/helpers/chartBySitesConfig";

import useAllProductList from "@hooks/core/useAllProductList";
import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";
import { selectProductInfoByScope } from "@selectors/activityEntryInfo/selectEntityInfoByScope";
import { selectProductInfoTotal } from "@selectors/activityEntryInfo/selectEntityInfoTotal";
import { t } from "i18next";



interface Props {
  campaignId: number;
  entries: ActivityEntryExtended[];
}

const scopeConfig = {
  [Scope.UPSTREAM]: { label: upperFirst(t("footprint.scope.upstream")), color: "#e0dff6" },
  [Scope.CORE]: { label: upperFirst(t("footprint.scope.core")), color: "#cce0fe" },
  [Scope.DOWNSTREAM]: { label: upperFirst(t("footprint.scope.downstream")), color: "#cbeedd" },
};

const ChartBySites = ({ campaignId, entries }: Props) => {
  const productInfoTotal = useSelector((state: RootState) =>
    selectProductInfoTotal(state, entries)
  );

  const productInfo = useSelector((state: RootState) =>
    selectProductInfoByScope(state, entries)
  );

  const productIds = Object.keys(productInfo).map(Number)

  const allProdutcs = useAllProductList();

  const labels = productIds.map(productId => allProdutcs[productId]?.name ?? "");

  const { tCo2: totalTco2 } = useAllEntriesInfoTotal(campaignId);

  const getPercentOfTotal = percentageCalculator(totalTco2);

  const datasets: DataChunk[] = Object.values(Scope)
    .reverse()
    .map(scope => {
      const rawEmissions = productIds.map(
        productId => productInfo[productId]?.[scope].tCo2 ?? 0
      );

      const tco2List = rawEmissions.map(convertToTons);
      return {
        label: scopeConfig[scope].label,
        backgroundColor: scopeConfig[scope].color,
        data: tco2List,
        custumTooltipMetadata: {
          rawValue: tco2List,
          percentTotal: rawEmissions.map(getPercentOfTotal),
        },
        tco2Totals: productIds
          .map(productId => productInfoTotal[productId]?.tCo2 ?? 0)
          .map(convertToTons),
      };
    });
  return (
    <Bar
      plugins={[ChartDataLabels]}
      data={{
        labels,
        datasets,
      }}
      options={chartBySitesOptions}
      datasetKeyProvider={uniqueId}
    />
  );
};

export default ChartBySites;
