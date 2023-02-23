import cx from "classnames";
import getEvolution from "./helpers/getEvolution";
import styles from "@styles/dashboard/campaign/sub/historyTable/evolutionCell.module.scss";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";

function formatEvolution(value: number): string {
  if (!isFinite(value)) {
    return "";
  }
  return `${value > 0 ? "+" : ""}${formatNumberWithLanguage(Math.floor(value * 100))} %`;
}

interface Props {
  className?: string;
  value1: number | null;
  value2: number | null;
}

const EvolutionCell = ({ className, value1, value2 }: Props) => {
  if (value1 == null || value2 == null) {
    return <td className={cx(styles.evolutionCell, className)}>-</td>;
  }
  const evolution = getEvolution(value1, value2);
  const isAugmentation = evolution > 0;
  const isReduction = evolution < 0;
  return (
    <td
      className={cx(
        styles.evolutionCell,
        { [styles.bold]: evolution !== 0 },
        className,
        {
          [styles.augmentation]: isAugmentation,
          [styles.reduction]: isReduction,
        }
      )}
    >
      {formatEvolution(evolution)}
    </td>
  );
};

export default EvolutionCell;
