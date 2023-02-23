import cx from "classnames";
import styles from "@styles/campaign/detail/trajectory/helpers/reductionBadge.module.scss";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import { Scope } from "@custom-types/wecount-api/activity";
import { scopeLabels } from "../utils/scopeLabels";
import { dynamicRounding } from "@lib/utils/calculator";
import { reformatReduction } from "@lib/core/campaign/getReductionNumbers";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";


interface Props {
  value: number;
  alternativeValue?: number;
  scope?: Scope;
  type?: "default" | "light";
  className?: string;
}

const ReductionBadge = ({
  value,
  alternativeValue,
  className,
  scope,
  type = "default",
}: Props) => {
  const color = styles["reductionBadgeBase"];
  const showTooltip = alternativeValue != 0 && alternativeValue != null;
  const roundedAlternativeValue = formatNumberWithLanguage(dynamicRounding((alternativeValue ?? 0) / 1000));
  const tooltip =
    scope != null
      ? `${upperFirst(t("trajectory.reduction.badge.part1", {scope: scopeLabels[scope]}))}, 
        ${t("trajectory.reduction.badge.part2", {roundedAlternativeValue: roundedAlternativeValue})}`
      : `${upperFirst(t("trajectory.reduction.badge.part2", {roundedAlternativeValue: roundedAlternativeValue}))}`;
  // const tooltip =
  //   scope != null
  //     ? `Projection sur le total des émissions de GES ${scopeLabels[scope]}, 
  //       soit ${roundedAlternativeValue} ${t("footprint.emission.tco2.tco2e")}`
  //     : `Soit ${roundedAlternativeValue} ${t("footprint.emission.tco2.tco2e")}`;

  return (
    <Tooltip content={showTooltip ? tooltip : null} hideDelay={0}>
      <div
        className={cx(
          styles.reductionBadge,
          className,
          color
        )}
      >
        {/* {value} % */}
        {reformatReduction(value)} %
        {/* {Math.abs(value) > 100 ? 100 : Math.abs(value) < 0 ? 0 : Math.abs(value)} % */}
      </div>
    </Tooltip>
  );
};

export default ReductionBadge;
