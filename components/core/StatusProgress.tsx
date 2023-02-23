import cx from "classnames";
import styles from "@styles/core/statusProgess.module.scss";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import StatusBadge from "./StatusBadge";
import { Status } from "@custom-types/core/Status";

const WIDTH_PLUS_COLOR_STATUS = 4;

interface Props {
  total: number;
  validated: number;
  toValidate: number;
  inProgress: number;
  className?: string;
  label?: string;
}

const StatusProgress = ({
  total,
  validated,
  toValidate,
  inProgress,
  className,
  label = "entrée",
}: Props) => {
  return (
    <div className={cx(styles.statusProgress, [className])}>
      <Tooltip
        placement="bottom"
        content={
          <div className={styles.tooltip}>
            <div className={styles.line}>
              <StatusBadge status={Status.TERMINATED} />
              <div className={styles.percent}>{validated}%</div>
            </div>
            <div className={styles.line}>
              <StatusBadge status={Status.TO_VALIDATE} />
              <div className={styles.percent}>{toValidate}%</div>
            </div>
            <div className={styles.line}>
              <StatusBadge status={Status.IN_PROGRESS} />
              <div className={styles.percent}>{inProgress}%</div>
            </div>
          </div>
        }
        hideDelay={0}
      >
        <div className={styles.progressBarContainer}>
          <div
            className={cx(styles.progressBar, styles.validated)}
            style={{
              width: `${validated > 0 ? validated + WIDTH_PLUS_COLOR_STATUS : 0
                }%`,
            }}
          ></div>
          <div
            className={cx(styles.progressBar, styles.toValidate)}
            style={{
              width: `${toValidate > 0 ? toValidate + WIDTH_PLUS_COLOR_STATUS : 0
                }%`,
              marginLeft: `${validated - 1}%`,
            }}
          ></div>
          <div
            className={cx(styles.progressBar, styles.inProgress)}
            style={{
              width: `${inProgress > 0 ? inProgress + WIDTH_PLUS_COLOR_STATUS : 0
                }%`,
              marginLeft: `${validated + toValidate - 1}%`,
            }}
          ></div>
        </div>
      </Tooltip>
    </div>
  );
};

export default StatusProgress;
