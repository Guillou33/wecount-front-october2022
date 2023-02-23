import cx from "classnames";
import styles from "@styles/core/counterBadge.module.scss";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import {
  reformatConvertToTons,
  formatPercentageDisplay,
} from "@lib/core/campaign/getEmissionNumbers";

interface Props {
  className?: string;
  lightMode?: boolean;
  inversed?: boolean;
  value: number;
  type?: "percent" | "raw";
  totalValue?: number;
  fontSize?: string;
}

const CounterBadge = (props: Props) => {
  return (
    <div
      className={cx(
        styles.main,
        props.className,
        { [styles.light]: props.lightMode },
        { [styles.inversed]: props.inversed }
      )}
    >
      {props.type && props.type === "percent"
        ? formatPercentageDisplay(props.value, props.totalValue ?? 0) + " %"
        : reformatConvertToTons(props.value) + " t"}
    </div>
  );
};

export default CounterBadge;
