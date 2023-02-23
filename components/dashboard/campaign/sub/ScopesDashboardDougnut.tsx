import { ActivityInfo } from "@hooks/core/helpers/activityInfo";
import { Doughnut } from "react-chartjs-2";
import { CategoryInfo } from "@hooks/core/useCategoryInfo";
import { Scope } from "@custom-types/wecount-api/activity";
import { getHashColor } from "@lib/utils/hashColor";
import { DataChunk, mainDashboardOptions } from "./helpers/mainDashboardConfig";
import { ActivityInfoByCategory } from "@hooks/core/helpers/getActivityInfoByCategory";
import { CampaignInformation } from "@reducers/campaignReducer";
import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  resultTco2Total: number;
  campaignInformation: CampaignInformation | undefined;
}

const ScopesDasboardDoughnut = ({
  resultTco2Total,
  campaignInformation,
}: Props) => {
  const buildDataSetForScope = (
    scope: Scope,
    label: string,
    color: string
  ): DataChunk => {
    let total: number;
    switch (scope) {
      case Scope.UPSTREAM:
        total = campaignInformation?.resultTco2Upstream ?? 0;
        break;
      case Scope.CORE:
        total = campaignInformation?.resultTco2Core ?? 0;
        break;
      case Scope.DOWNSTREAM:
        total = campaignInformation?.resultTco2Downstream ?? 0;
        break;
    }

    return {
      label,
      backgroundColor: color,
      data: [
        scope !== Scope.UPSTREAM || !resultTco2Total
          ? 0
          : Math.round(
              (100 * (campaignInformation?.resultTco2Upstream ?? 0)) /
                resultTco2Total
            ),
        scope !== Scope.CORE || !resultTco2Total
          ? 0
          : Math.round(
              (100 * (campaignInformation?.resultTco2Core ?? 0)) /
                resultTco2Total
            ),
        scope !== Scope.DOWNSTREAM || !resultTco2Total
          ? 0
          : Math.round(
              (100 * (campaignInformation?.resultTco2Downstream ?? 0)) /
                resultTco2Total
            ),
      ],
      custumTooltipMetadata: {
        rawValue: total,
        percentTotal: !resultTco2Total
          ? 0
          : Math.round((100 * 100 * total) / resultTco2Total) / 100,
      },
    };
  };

  return (
    <Doughnut
      height={200}
      data={{
        labels: [upperFirst(t("footprint.scope.upstream")), upperFirst(t("footprint.scope.core")), upperFirst(t("footprint.scope.downstream"))],
        datasets: [
          {
            data: [
              !resultTco2Total ? 0 : (Math.round(100 * (campaignInformation?.resultTco2Upstream ?? 0) / resultTco2Total)),
              !resultTco2Total ? 0 : (Math.round(100 * (campaignInformation?.resultTco2Core ?? 0) / resultTco2Total)),
              !resultTco2Total ? 0 : (Math.round(100 * (campaignInformation?.resultTco2Downstream ?? 0) / resultTco2Total)),
            ],
            backgroundColor: [
              "#9895e0",
              "#599cfb",
              "#56c990",
            ],
          }
        ],
      }}
      options={{
        legend: {
          display: true,
        },
        tooltips: {
          callbacks: {
            label: (tooltipItem: any, data: any) => {
              return `${data.labels[tooltipItem.index]} : ${data.datasets[0].data[tooltipItem.index]}%`;
              
            },
          },
        },
        plugins: {
          datalabels: {
            display: false,
          }
        } 
      }}
    />
  );
};

export default ScopesDasboardDoughnut;
