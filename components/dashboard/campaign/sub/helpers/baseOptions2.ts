import { EChartsOption, LinearGradientObject } from "echarts";
import { t } from "i18next";
import { upperFirst } from "lodash";

export const defaultFontSize = 15;

const baseOptions2: EChartsOption = {
  animation: true,
  toolbox: {
    right: 20,
    itemGap: 15,
    feature: {
      dataView: {
        show: true,
        title: upperFirst(t("footprint.emission.rawData")),
        readOnly: true,
        lang: [
          upperFirst(t("footprint.emission.rawData")),
          upperFirst(t("global.common.close")),
          "",
        ],
      },
      saveAsImage: {
        show: true,
        title: upperFirst(t("global.download")),
      },
    },
  },
};

export default baseOptions2;
