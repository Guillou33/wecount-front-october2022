import { HorizontalBar } from "react-chartjs-2";
import { useDispatch } from "react-redux";

import { setCurrentView } from "@actions/dashboards/dashboardsActions";
import { DashboardView } from "@reducers/dashboards/dashboardsReducer";

import useAllEntriesInfoByScope from "@hooks/core/activityEntryInfo/useAllEntriesInfoByScope";
import { convertToTons } from "@lib/utils/calculator";
import { Scope } from "@custom-types/wecount-api/activity";

import ReportLink from "@components/campaignReport/sub/ReportLink";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  campaignId: number;
}

const ScopeChart = ({ campaignId }: Props) => {
  const dispatch = useDispatch();
  const activityInfoByScope = useAllEntriesInfoByScope(campaignId);

  const hasEmissions =
    activityInfoByScope[Scope.UPSTREAM].tCo2 > 0 ||
    activityInfoByScope[Scope.CORE].tCo2 > 0 ||
    activityInfoByScope[Scope.DOWNSTREAM].tCo2 > 0;

  const labels = [upperFirst(t("footprint.scope.upstream")), upperFirst(t("footprint.scope.core")), upperFirst(t("footprint.scope.downstream"))];
  const datasets = [
    {
      data: [
        convertToTons(activityInfoByScope[Scope.UPSTREAM].tCo2),
        convertToTons(activityInfoByScope[Scope.CORE].tCo2),
        convertToTons(activityInfoByScope[Scope.DOWNSTREAM].tCo2),
      ],
      backgroundColor: "#7d88ca",
    },
  ];

  const options = {
    legend: false,
    scales: {
      xAxes: [
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
      yAxes: [
        {
          stacked: true,
          gridLines: {
            display: false,
          },
        },
      ],
    },
    tooltips: {
      displayColors: false,
      callbacks: {
        label: (ctx: any) => `${ctx.value} ${t("footprint.emission.tco2.tco2e")}`,
      },
    },
    plugins: {
      datalabels: {
        display: false,
      },
    },
  };

  function goToEmissionDashboard() {
    dispatch(setCurrentView(DashboardView.EMISSION));
  }

  return (
    <div>
      <HorizontalBar data={{ labels, datasets }} options={options} />
      {hasEmissions ? (
        <ReportLink
          href={`/dashboards/${campaignId}`}
          onClick={goToEmissionDashboard}
        />
      ) : (
        <ReportLink href={`/campaigns/${campaignId}`}>
          {upperFirst(t("global.beginPrompt"))}
        </ReportLink>
      )}
    </div>
  );
};

export default ScopeChart;
