import { UnitMode } from "./ReglementationTable";

import { convertToTons, roundValue } from "@lib/utils/calculator";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";

interface Props {
  children: number;
  unitMode: UnitMode;
  bold?: boolean;
}

const ResultCell = ({ unitMode, bold = false, children }: Props) => {
  const format = unitMode === "t" ? convertToTons : roundValue;
  const formatedResult = formatNumberWithLanguage(format(children));
  return (
    <td className="text-center text-nowrap">
      {bold ? (
        <>
          <b>{formatedResult}</b>
        </>
      ) : (
        <>
          {formatedResult}
        </>
      )}
    </td>
  );
};

export default ResultCell;
