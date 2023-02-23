import { Scope } from "@custom-types/wecount-api/activity";
import { t } from "i18next";
import { upperFirst } from "lodash";

export const scopeLabelsDiminutive = {
  [Scope.UPSTREAM]: upperFirst(t("footprint.scope.upstream")),
  [Scope.CORE]: upperFirst(t("footprint.scope.core")),
  [Scope.DOWNSTREAM]: upperFirst(t("footprint.scope.downstream")),
};

export const scopeLabels = {
  [Scope.UPSTREAM]: `${upperFirst(t("footprint.scope.upstream"))} (Scope 3)`,
  [Scope.CORE]: `${upperFirst(t("footprint.scope.core"))} (Scope 1+2)`,
  [Scope.DOWNSTREAM]: `${upperFirst(t("footprint.scope.downstream"))} (Scope 3)`,
};
