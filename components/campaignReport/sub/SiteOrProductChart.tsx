import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { uniqueId, upperFirst } from "lodash";

import useSetOnceSites from "@hooks/core/reduxSetOnce/useSetOnceSites";
import useAllSiteList from "@hooks/core/useAllSiteList";
import useSetOnceProducts from "@hooks/core/reduxSetOnce/useSetOnceProducts";
import useSiteInfoTotal from "@hooks/core/activityEntryInfo/useSiteInfoTotal";
import useProductInfoTotal from "@hooks/core/activityEntryInfo/useProductInfoTotal";
import useAllProductList from "@hooks/core/useAllProductList";

import useSetAllEntries from "@hooks/core/reduxSetOnce/useSetAllEntries";

import { convertToTons } from "@lib/utils/calculator";
import { t } from "i18next";

export type ChartType = "site" | "product";

interface Props {
  campaignId: number;
  displayedChart: ChartType;
}

const SitesChart = ({ campaignId, displayedChart }: Props) => {
  useSetAllEntries(campaignId);
  useSetOnceSites();
  const allSiteList = useAllSiteList();
  const sitesActivityInfo = useSiteInfoTotal(campaignId);

  useSetOnceProducts();
  const allProductList = useAllProductList();
  const productsActivityInfo = useProductInfoTotal(campaignId);

  const displayedActivityInfo =
    displayedChart === "site" ? sitesActivityInfo : productsActivityInfo;

  const displayedEntityList =
    displayedChart === "site" ? allSiteList : allProductList;

  const labels = Object.keys(displayedActivityInfo).map(
    id => displayedEntityList[Number(id)]?.name ?? ""
  );

  const datasets = [
    {
      data: Object.values(displayedActivityInfo).map(entryInfo => convertToTons(entryInfo.tCo2)),
      backgroundColor: "#7d88ca",
    },
  ];

  return (
    <Bar
      plugins={[ChartDataLabels]}
      data={{ labels, datasets }}
      options={options}
      datasetKeyProvider={uniqueId}
    />
  );
};

export default SitesChart;

const options = {
  legend: false,
  layout: {
    padding: { top: 25 },
  },
  scales: {
    xAxes: [
      {
        stacked: true,
        gridLines: {
          display: false,
        },
      },
    ],
    yAxes: [
      {
        scaleLabel: {
          display: true,
          labelString: upperFirst(t("footprint.emission.tco2.equivalentTco2")),
        },

        stacked: true,
        ticks: {
          beginAtZero: true,
        },
        type: "linear",
      },
    ],
  },
  tooltips: {
    displayColors: false,
    callbacks: {
      label: (ctx: any) => {
        return `${ctx.value} ${t("footprint.emission.tco2.tco2e")}`;
      },
    },
  },
  plugins: {
    datalabels: {
      anchor: "end",
      align: "top",
      formatter: (value: string) => `${value} ${t("footprint.emission.tco2.tco2e")}`,
    },
  },
};
