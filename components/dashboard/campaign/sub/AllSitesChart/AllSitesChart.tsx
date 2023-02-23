import ReactEChart from "@components/helpers/echarts/ReactEChart";
import EChartSizer from "@components/helpers/echarts/EChartSizer";
import { useSelector } from "react-redux";
import merge from "lodash/fp/merge";
import { t } from "i18next";

import { selectSiteInfoTotal } from "@selectors/activityEntryInfo/selectEntityInfoTotal";
import selectRootSiteTotals from "@selectors/sites/selectRootSiteTotals";
import selectSitesTotalsByRootSites from "@selectors/sites/selectSitesTotalsByRootSites";
import useAllSiteList from "@hooks/core/useAllSiteList";

import { RootState } from "@reducers/index";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import { EChartsOption, BarSeriesOption } from "echarts";
import Spinner from "@components/helpers/ui/Spinner";

import mapObject from "@lib/utils/mapObject";
import { arrayProjection } from "@lib/utils/arrayProjection";
import { getPalette, Color } from "@lib/utils/hashColor";
import chartOptions from "@components/dashboard/campaign/sub/ComparisonCharts/helpers/chartOptions";
import { wecountFormat } from "@lib/core/campaign/getEmissionNumbers";

interface Props {
  entries: ActivityEntryExtended[];
}

const AllSitesChart = ({ entries }: Props) => {
  const areSitesFetched = useSelector(
    (state: RootState) => state.core.site.isFetched
  );

  const allSites = useAllSiteList({ includeSubSites: true });

  const siteInfoTotal = useSelector((state: RootState) =>
    selectSiteInfoTotal(state, entries)
  );
  const rootSiteTotals = useSelector((state: RootState) =>
    selectRootSiteTotals(state, entries)
  );
  const siteTotalsByRootSites = useSelector((state: RootState) =>
    selectSitesTotalsByRootSites(state, entries)
  );

  const sortedSiteIdsByRootSites = mapObject(
    siteTotalsByRootSites,
    siteTotalsByRootSite => {
      return Object.keys(siteTotalsByRootSite)
        .map(siteId => Number(siteId))
        .sort((siteIdA, siteIdB) => {
          return (
            (siteInfoTotal[siteIdB]?.tCo2 ?? 0) -
            (siteInfoTotal[siteIdA]?.tCo2 ?? 0)
          );
        });
    }
  );
  const palete = [...getPalette(Color.EMISSION_BLUE)].reverse();

  const colors = mapObject(sortedSiteIdsByRootSites, siteIdsByRootSite =>
    arrayProjection(siteIdsByRootSite, palete)
  );
  const maxSubSiteByRootSite = Object.values(sortedSiteIdsByRootSites).reduce(
    (acc, subSites) => {
      if (subSites.length > acc) {
        return subSites.length;
      }
      return acc;
    },
    0
  );

  const sortedRootSiteIds = Object.keys(rootSiteTotals)
    .map(siteId => Number(siteId))
    .sort((siteIdA, siteIdB) => {
      return rootSiteTotals[siteIdA].tCo2 - rootSiteTotals[siteIdB].tCo2;
    });

  let series: BarSeriesOption[] = [];
  for (let i = 0; i < maxSubSiteByRootSite; i++) {
    series.push({
      type: "bar",
      stack: "stack",
      data: sortedRootSiteIds.map(rootSiteId => {
        const subSiteLength = sortedSiteIdsByRootSites[rootSiteId].length;
        const subSiteId = sortedSiteIdsByRootSites[rootSiteId][i];
        const value = (siteInfoTotal[subSiteId]?.tCo2 ?? 0) / 1000;
        const directAssignation =
          subSiteId === rootSiteId && subSiteLength !== 1
            ? ` (${t("site.directAssignation")})`
            : "";

        return {
          value,
          itemStyle: {
            color:
              subSiteLength === 1 ? palete[0] : colors[rootSiteId]?.[subSiteId],
          },
          label: {
            show: i === maxSubSiteByRootSite - 1,
            position: "right",
            formatter: () => {
              return wecountFormat(rootSiteTotals[rootSiteId].tCo2 / 1000);
            },
            silent: true,
          },
          name: allSites[subSiteId]?.name + directAssignation,
        };
      }),
      tooltip: {
        valueFormatter: value =>
          `${wecountFormat(Number(value))} ${t(
            "footprint.emission.tco2.tco2e"
          )}`,
      },
    });
  }

  const options: EChartsOption = {
    series,
    yAxis: {
      axisLabel: {
        show: true,
      },
      data: sortedRootSiteIds.map(id => {
        return allSites[Number(id)]?.name;
      }),
    },
    grid: {
      containLabel: true,
      left: 20,
      right: 20,
    },
  };

  return (
    <EChartSizer numberOfElement={sortedRootSiteIds.length}>
      {areSitesFetched ? (
        <ReactEChart option={merge(chartOptions, options)} notMerge />
      ) : (
        <Spinner />
      )}
    </EChartSizer>
  );
};

export default AllSitesChart;
