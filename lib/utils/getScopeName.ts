import { Scope } from "@custom-types/wecount-api/activity";
import { t } from "i18next";
import { upperFirst } from "lodash";

export default function getScopeName(scope: string): string {
  switch (scope) {
    case Scope.UPSTREAM:
      return upperFirst(t("footprint.scope.upstream"));
    case Scope.CORE:
      return upperFirst(t("footprint.scope.core"));
    case Scope.DOWNSTREAM:
      return upperFirst(t("footprint.scope.downstream"));
    default:
      return upperFirst(t("footprint.scope.unhandled"));
  }
}
