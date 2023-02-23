import { useRouter } from "next/router";
import Link from "next/link";
import cx from "classnames";

import FeatureMenu from "./FeatureMenu";
import IfHasPerimeterRole from "@components/auth/access-control/IfHasPerimeterRole";
import { PerimeterRole } from "@custom-types/wecount-api/auth";

import styles from "@styles/layout/sub/featureMenu.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

const EmissionMenu = () => {
  const router = useRouter();

  return (
    <FeatureMenu
      title={upperFirst(t("footprint.carbon"))}
      icon={<i className={cx("fas fa-chart-bar")}></i>}
      basePath="campaigns"
      subMenu="cartography"
      beforeLinks={
        <IfHasPerimeterRole role={PerimeterRole.PERIMETER_MANAGER}>
          <Link href="/campaigns">
            <div
              className={cx(styles.subMenuItem, {
                [styles.active]: router.asPath === "/campaigns",
              })}
            >
              <p className={cx(styles.subMenuText, styles.allCampaigns)}>
                <i className={cx("fas fa-eye", styles.eyeIcon)}></i> {upperFirst(t("global.seeAll"))}
              </p>
              <i className={cx("fas fa-circle", styles.activeMarker)}></i>
            </div>
          </Link>
        </IfHasPerimeterRole>
      }
    />
  );
};

export default EmissionMenu;
