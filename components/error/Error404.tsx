import styles from '@styles/error/generic.module.scss';
import { t } from 'i18next';
import { upperFirst } from 'lodash';

const Error404 = () => {
  return (
    <div className={styles.main}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>{upperFirst(t("error.error404"))}</h1>
        <p className={styles.mainText}>
          {upperFirst(t("error.pageNotFound"))}...
        </p>
      </div>
    </div>
  );
};

export default Error404;
