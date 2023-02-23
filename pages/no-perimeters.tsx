import Head from "next/head";
import requireAuth from "@components/hoc/auth/requireAuth";
import styles from "@styles/noPerimeterPage.module.scss";
import cx from "classnames";
import { upperFirst } from "lodash";
import { t } from "i18next";

const NoPerimeterPage = () => {
  return (
    <>
      <Head>
        <title>{upperFirst(t("campaign.campaigns"))} - Wecount</title>
      </Head>
      <div className={styles.noPerimeterPage}>
        <div className={cx("alert alert-danger", styles.alert)}>
          <i className="fa fa-exclamation-triangle"></i>
          <div className="ml-3">
            <p>
              <strong>{upperFirst(t("user.account.accessDenied"))}</strong>
            </p>
            <p>
              {upperFirst(t("user.account.noData.part1"))}. {upperFirst(t("user.account.noData.part2"))}
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default requireAuth(NoPerimeterPage);
