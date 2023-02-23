import { Result } from "./getCampaignResultsDiff";

function getAbsoluteMaximum(
  acc: number,
  { value }: Result
): number {
  if (acc == null) {
    acc = Math.abs(value);
    return acc;
  }
  if (acc < Math.abs(value)) {
    return Math.abs(value);
  }
  return acc;
}

export default getAbsoluteMaximum;
