import { formatPercentageDisplay, reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";
import { UnitModes } from "@reducers/campaignReducer";
import { t } from "i18next";

interface RawUnitModeProps {
  unitMode?: UnitModes.RAW;
}

interface PercentUnitModeProps {
  unitMode: UnitModes.PERCENT;
  total: number;
}

type Props = (RawUnitModeProps | PercentUnitModeProps) & {
  className?: string;
  tco2: number;
  rawUnitLabel?: string;
  percentUnitLabel?: string;
};

const ResultDisplayer = (props: Props) => {
  return (
    <span className={props.className}>
      {props.unitMode === UnitModes.PERCENT
        ? `${formatPercentageDisplay(props.tco2, props.total)} ${
            props.percentUnitLabel ?? " %"
          }`
        : `${reformatConvertToTons(props.tco2)} ${
            props.rawUnitLabel ?? ` ${t("footprint.emission.tco2.tco2e")}`
          }`}
    </span>
  );
};

export default ResultDisplayer;
