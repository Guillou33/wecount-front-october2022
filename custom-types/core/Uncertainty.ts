import { t } from "i18next";
import { upperFirst } from "lodash";

export const UNCERTAINTY = [
  {
    value: 0,
    name: "0"
  },
  {
    value: 0.1,
    name: "10"
  },
  {
    value: 0.2,
    name: "20"
  },
  {
    value: 0.3,
    name: "30"
  },
  {
    value: 0.4,
    name: "40"
  },
  {
    value: 0.5,
    name: "50"
  },
  {
    value: 0.6,
    name: "60"
  },
  {
    value: 0.7,
    name: "70"
  },
  {
    value: 0.8,
    name: "80"
  },
  {
    value: 0.9,
    name: "90"
  },
];

export const SIMPLIFIED_UNCERTAINTY = [
  {
    value: 0,
    name: `${upperFirst(t("global.none.fem"))} - 0%`
  },
  {
    value: 0.05,
    name: `${upperFirst(t("global.adjective.levels.low"))} - 5%`
  },
  {
    value: 0.3,
    name: `${upperFirst(t("global.adjective.levels.med.fem"))} - 30%`
  },
  {
    value: 0.5,
    name: `${upperFirst(t("global.adjective.levels.high.fem"))} - 50%`
  },
  {
    value: 0.50001, // to have different values for "Forte" and "Ne sais pas"
    name: `${upperFirst(t("global.dontKnow"))} - 50%`
  },
];

export const DEFAULT_UNCERTAINTY = 0.05;

export const readableUncertainty = (uncertainty: number) => {
  const simplifiedFiltered = SIMPLIFIED_UNCERTAINTY.filter(currentUncertainty => currentUncertainty.value === uncertainty);

  if (!simplifiedFiltered.length) {
    const baseUncertaintyFiltered = UNCERTAINTY.filter(currentUncertainty => currentUncertainty.value === uncertainty);
    if (!baseUncertaintyFiltered.length) {
      return '';
    }
    return `${baseUncertaintyFiltered[0].name} %`;
  }

  return simplifiedFiltered[0].name;
};
