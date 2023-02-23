import merge from "lodash/fp/merge";
import { t } from "i18next";


import { EChartsOption } from "echarts";
import baseOptions from "@components/helpers/echarts/baseOptions";

const chartOptions: EChartsOption = {
  yAxis: {
    type: "category",
    axisLine: { show: false },
    axisLabel: { show: false },
    axisTick: { show: false },
    splitLine: { show: false },
    name: "",
  },
  xAxis: {
    type: "value",
    name: t("footprint.emission.tco2.tco2e"),
    nameLocation: "middle",
    nameGap: 50,
  },
};

export default merge(baseOptions, chartOptions);
