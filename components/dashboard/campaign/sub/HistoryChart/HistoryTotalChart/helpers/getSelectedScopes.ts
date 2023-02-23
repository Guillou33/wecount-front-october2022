import { Scope } from "@custom-types/wecount-api/activity";
import getScopeName from "@lib/utils/getScopeName";

export type ScopeSelection = { Amont: boolean; Coeur: boolean; Aval: boolean };

function getSelectedScopes(scopeSelection: ScopeSelection): Scope[] {
  return Object.entries(scopeSelection).reduce(
    (selectedScopes, [scopeName, isSelected]) => {
      let scope: Scope | null = null;
      if (scopeName === getScopeName(Scope.UPSTREAM)) {
        scope = Scope.UPSTREAM;
      }
      if (scopeName === getScopeName(Scope.CORE)) {
        scope = Scope.CORE;
      }
      if (scopeName === getScopeName(Scope.DOWNSTREAM)) {
        scope = Scope.DOWNSTREAM;
      }
      if (isSelected && scope !== null) {
        selectedScopes.push(scope);
      }
      return selectedScopes;
    },
    [] as Scope[]
  );
}

export { getSelectedScopes };
