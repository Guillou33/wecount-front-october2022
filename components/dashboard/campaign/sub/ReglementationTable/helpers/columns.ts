import { Result } from "@selectors/reglementationTables/helpers/sumReglementationTableResults";
import { t } from "i18next";
import { upperFirst } from "lodash";

export type Column =
  | "result"
  | "uncertainty"
  | "co2"
  | "ch4"
  | "n2O"
  | "fluoredGaz"
  | "otherGaz"
  | "co2bCombustion"
  | "co2bOther"
  | "co2b"
  | "hfc"
  | "pfc"
  | "sf6";

export const columnLabels: { [key in Column]: string } = {
  co2: "CO2",
  co2b: "CO2 b",
  ch4: "CH4",
  n2O: "N2O",
  otherGaz: upperFirst(t("footprint.otherGhg")),
  hfc: "HFCs",
  pfc: "PFCs",
  sf6: "SF6",
  fluoredGaz: upperFirst(t("footprint.fluored")),
  co2bCombustion: upperFirst(t("footprint.combustion")),
  co2bOther: upperFirst(t("footprint.nonCombustion")),
  uncertainty: upperFirst(t("entry.uncertainty")),
  result: upperFirst(t("global.common.total")),
};

export function getTco2ForColumn(
  column: Column,
  gazRepartition: Result | undefined
): number {
  if (gazRepartition == null) {
    return 0;
  }
  if (column === "uncertainty") {
    return Math.sqrt(
      gazRepartition.uncertainties.reduce((acc, value) => acc + value ** 2, 0)
    );
  }
  return gazRepartition[column];
}
