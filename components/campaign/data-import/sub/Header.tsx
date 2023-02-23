import { upperFirst } from "lodash";
import { t } from "i18next";
import cx from "classnames";

import { CampaignInformation } from "@reducers/campaignReducer";

import { getCampaignTypeShortName } from "@lib/core/campaign/getCampaignTypeName";
import { statusReadable } from "@lib/core/campaign/statusReadable";

import styles from "@styles/campaign/data-import/sub/header.module.scss";

interface Props {
  campaignInformations: CampaignInformation;
}

const Header = ({ campaignInformations }: Props) => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <h1 className={styles.title}>{upperFirst(t("dataImport.title"))}</h1>
        <div className={styles.campaignInfo}>
          <div className={cx(styles.campaignName)}>
            {campaignInformations.name}
          </div>
          <div className={styles.info}>
            <img
              className={cx(styles.infoIcon, styles.nudgeUp)}
              src="/icons/icon-calendar-color-primary-2.svg"
              alt="calendrier"
            />
            {upperFirst(t("global.time.year"))} :
            <span className={styles.infoValue}>
              {campaignInformations.year ?? "non définie"}
            </span>
          </div>
          <div className={styles.info}>
            <img
              className={styles.infoIcon}
              src="/icons/icon-target-color-primary-2.svg"
              alt="cible"
            />
            <span>{upperFirst(t("global.common.type"))} :</span>
            <span className={styles.infoValue}>
              {getCampaignTypeShortName(campaignInformations.type)}
            </span>
          </div>
          <div className={styles.info}>
            <img
              className={cx(styles.infoIcon, styles.nudgeUp)}
              src="/icons/icon-box-color-primary-2.svg"
              alt="cible"
            />
            <span>{upperFirst(t("status.status.singular"))} :</span>
            <span className={styles.infoValue}>
              {upperFirst(statusReadable(campaignInformations.status))}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
