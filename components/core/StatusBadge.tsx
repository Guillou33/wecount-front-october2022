import cx from 'classnames';
import { Status } from '@custom-types/core/Status';
import _ from 'lodash';
import styles from '@styles/core/statusBadge.module.scss'
import i18next, { t } from 'i18next';

interface Props {
  status: Status;
  className?: string;
  small?: boolean;
}

const StatusBadge = (props: Props) => {
  let statusMessage: string;
  let className: string;
  const getLanguage = i18next.languages[0];
  switch (props.status) {
    case Status.IN_PROGRESS:
      statusMessage = t("entry.status.inProgress");
      className = 'in-progress';
      break;
    case Status.TO_VALIDATE:
      statusMessage = t("entry.status.toValidate");
      className = 'to-validate';
      break;
    case Status.TERMINATED:
      statusMessage = t("entry.status.terminated");
      className = 'terminated';
      break;
    case Status.ARCHIVED:
      statusMessage = t("entry.status.archived");
      className = 'archived';
      break;
    default:
      statusMessage = t("entry.status.inProgress");
      className = 'in-progress';
      break;
  }

  return (
    <div className={cx(styles.main, styles[className], props.className)}>
      <i className={cx('fas fa-circle', styles.circleIcon)}></i>
      {!props.small && <p>{statusMessage.toLocaleUpperCase(getLanguage)}</p>}
    </div>
  );
}

export default StatusBadge;