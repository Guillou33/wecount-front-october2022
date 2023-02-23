import { Result } from "./getCampaignResultsDiff";

function convertResult(result: Result): Result {
  return {
    ...result,
    value: result.value / 1000,
  };
}

export default convertResult;
