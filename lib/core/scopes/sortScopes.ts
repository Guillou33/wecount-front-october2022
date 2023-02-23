import { Scope } from "@custom-types/wecount-api/activity";

const scopeOrder = {
  [Scope.UPSTREAM]: 1,
  [Scope.CORE]: 2,
  [Scope.DOWNSTREAM]: 3,
};

function sortScope(scopeA: Scope, scopeB: Scope): number {
  return scopeOrder[scopeA] - scopeOrder[scopeB];
}

export default sortScope;
