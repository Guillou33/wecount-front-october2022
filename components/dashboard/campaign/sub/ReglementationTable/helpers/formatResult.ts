import { UnitMode } from "../ReglementationTable";
import { Column } from "./columns";
import { convertToTons, roundValue } from "@lib/utils/calculator";

function formatResult(
  result: number,
  unitMode: UnitMode,
  column: Column
): number {
  const effectiveUnitMode = column === "uncertainty" ? "t" : unitMode;
  const format = effectiveUnitMode === "t" ? convertToTons : roundValue;
  return format(result);
}

export default formatResult;
