import { t } from "i18next";
import { upperFirst } from "lodash";

export const excludedOptions: { label: string; value: number }[] = [
  {
    // None of the Option is checked
    label: upperFirst(t("filter.trajectory.none")),
    value: 0,
  },
  {
    label: upperFirst(t("filter.trajectory.includedData")),
    value: 1,
  },
  {
    label: upperFirst(t("filter.trajectory.excludedData")),
    value: 2,
  },
  {
    // All Options are checked
    label: upperFirst(t("filter.trajectory.all")),
    value: 3,
  },
];
