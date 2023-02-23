import cx from "classnames";
import styles from "@styles/dashboard/campaign/sub/overviewTable.module.scss";
import { convertToTons, getVariationPercentage } from "@lib/utils/calculator";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

interface Props {
  resultTco2: number;
  targetTco2: number;
}

const ActionPlanCell = ({ resultTco2, targetTco2 }: Props) => {
  return (
    <td className={cx(styles.actionPlanCell, "text-center", "text-nowrap")}>
      {resultTco2 !== targetTco2 ? (
        <>
          <div>
            <b>{reformatConvertToTons(targetTco2)}</b> t
          </div>
          <div className="small">
            <b>-{getVariationPercentage(resultTco2, targetTco2)}</b> %
          </div>
        </>
      ) : (
        <span className="font-italic text-muted">n/a</span>
      )}
    </td>
  );
};

export default ActionPlanCell;
