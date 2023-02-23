import cx from "classnames";
import styles from "@styles/campaign/detail/trajectory/trajectoryScopeCard.module.scss";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import { Scope } from "@custom-types/wecount-api/activity";
import { scopeLabels } from "../utils/scopeLabels";
import { convertToTons, dynamicRounding } from "@lib/utils/calculator";
import { reformatReduction } from "@lib/core/campaign/getReductionNumbers";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";


interface ReductionBadgeProps {
    value: number;
    alternativeValue?: number;
    scope?: Scope;
    type?: "default" | "light";
    className?: string;
}

export const ReductionField = ({
    value,
    alternativeValue,
    className,
    scope,
    type = "default",
}: ReductionBadgeProps) => {
    const color = value > 0 ? styles["reductionBadgeUp"] : value < 0 ? styles["reductionBadgeDown"] : styles["reductionBadgeBase"];
    const showTooltip = alternativeValue != 0 && alternativeValue != null;
    const roundedAlternativeValue = formatNumberWithLanguage(dynamicRounding((alternativeValue ?? 0) / 1000));
    const tooltip =
        scope != null
        ? `${upperFirst(t("trajectory.reduction.badge.part1", {scope: scopeLabels[scope]}))}, 
            ${t("trajectory.reduction.badge.part2", {roundedAlternativeValue: roundedAlternativeValue})}`
        : `${upperFirst(t("trajectory.reduction.badge.part2", {roundedAlternativeValue: roundedAlternativeValue}))}`;

    return (
        <Tooltip content={showTooltip ? tooltip : null} hideDelay={0}>
            <p className={cx(
                className,
                styles.reductionBadgeText,
                color
            )}>
                {/* {value} % */}
                {value > 0 ? "+ " : value < 0 ? "- " : ""} {reformatReduction(value)} %
            </p>
        </Tooltip>
    );
};
