import { Result } from "./getCampaignResultsDiff";

function sortResults(resultA: Result, resultB: Result): number {
  if (resultA.value === 0) {
    return -1;
  }
  if (resultB.value === 0) {
    return 1;
  }
  return resultB.value - resultA.value;
}

export default sortResults;
