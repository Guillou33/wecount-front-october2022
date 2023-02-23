import cx from 'classnames';
import styles from '@styles/core/privateBadge.module.scss'
import { upperFirst } from 'lodash';
import { t } from 'i18next';

interface Props {
  className?: string;
}

const PrivateBadge = ({ className }: Props) => {
  return (
    <div className={cx("badge", styles.privateBadge, className)}>
      <p>{upperFirst(t("global.adjective.private.masc"))}</p>
    </div>
  );
}

export default PrivateBadge;