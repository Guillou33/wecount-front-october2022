import upperFirst from "lodash/upperFirst";
import { t } from "i18next";

function getDefaultPossibleValue(): Record<number, { name: string }> {
  return {
    [-1]: { name: upperFirst(t("entry.unaffected")) },
  };
}

export default getDefaultPossibleValue;
