import { EChartsOption, LinearGradientObject } from "echarts";
import { t } from "i18next";
import { upperFirst } from "lodash";

export const defaultFontSize = 15;

const baseOptions: EChartsOption = {
  animation: false,
  title: {
    textStyle: {
      color: "#1B2769",
      fontSize: 20,
    },
  },
  grid: {
    top: 70,
    bottom: 80,
  },
  xAxis: {
    type: "category",
    axisTick: {
      show: false,
    },
    axisLabel: {
      fontSize: defaultFontSize,
    },
  },
  yAxis: {
    type: "value",
    name: t("footprint.emission.tco2.tco2e"),
    nameLocation: "middle",
    nameRotate: 90,
    nameGap: 70,
    nameTextStyle: {
      fontSize: defaultFontSize,
    },
    axisLabel: {
      fontSize: defaultFontSize,
      formatter: (value: number) => value.toLocaleString(),
    },
  },
  tooltip: {
    axisPointer: {
      type: "none",
    },
    valueFormatter: value => {
      return `${value} ${t("footprint.emission.tco2.tco2e")}`;
    },
  },
  series: {
    label: {
      fontSize: 15,
    },
  },
  toolbox: {
    right: 30,
    itemGap: 15,
    feature: {
      dataZoom: {
        show: true,
        title: {
          back: upperFirst(t("global.common.zoomOut")),
        },
        filterMode: "none",
      },
      dataView: {
        show: true,
        title: upperFirst(t("footprint.emission.rawData")),
        lang: [
          upperFirst(t("footprint.emission.rawData")),
          upperFirst(t("global.common.close")),
          "",
        ],
        readOnly: true,
      },
      saveAsImage: {
        show: true,
        title: upperFirst(t("global.download")),
      },
    },
  },
};

export function getDualColorLegend(
  color1: string,
  color2: string
): LinearGradientObject {
  return {
    type: "linear",
    x: 0,
    y: 0,
    x2: 1,
    y2: 1,
    colorStops: [
      {
        offset: 0,
        color: color1,
      },
      {
        offset: 0.5,
        color: color1,
      },
      {
        offset: 0.5,
        color: color2,
      },
      {
        offset: 1,
        color: color2,
      },
    ],
  };
}

export default baseOptions;
