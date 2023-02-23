import cx from "classnames";
import styles from "@styles/core/tco2ResultBadge.module.scss";
import { t } from "i18next";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

interface Props {
  resultTco2: number;
  totalResultTco2: number;
  notExcludedResultTco2: number;
  reductionTarget?: number;
  className?: string;
  active: number;
}

const getActiveExcludedFilter = (active: number) => {
  return active === 0 || active === 3 ? 0 : active;
}

const Tco2ResultBadge = ({ 
  resultTco2,
  totalResultTco2,
  notExcludedResultTco2,
  reductionTarget, 
  className,
  active
}: Props) => {
  return (
    <div className={cx(styles.tco2resultBadge, [className])}>
      <p className={styles.tco2}>{reformatConvertToTons(resultTco2)} {t("footprint.emission.tco2.tco2e")} </p>
      {getActiveExcludedFilter(active) === 0 ? 
        <p className={styles.additionalTco2}>{t("global.other.ofWhich")} {reformatConvertToTons(totalResultTco2 - notExcludedResultTco2)} {t("footprint.emission.tco2.tco2e")} {t("filter.trajectory.excluded.femPlural")}</p> :
        active === 1 ? (
          <p className={styles.additionalTco2}>{t("global.other.and")} {reformatConvertToTons(totalResultTco2 - resultTco2)} {t("footprint.emission.tco2.tco2e")} {t("filter.trajectory.excluded.femPlural")}</p>
        ) : (
          <p className={styles.additionalTco2}>{t("global.other.and")} {reformatConvertToTons(notExcludedResultTco2)} {t("footprint.emission.tco2.tco2e")} {t("filter.trajectory.included.femPlural")}</p>
        )
      }
    </div>
  );
};

export default Tco2ResultBadge;
