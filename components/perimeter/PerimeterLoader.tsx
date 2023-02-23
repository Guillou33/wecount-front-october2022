import { isEmpty, upperFirst } from "lodash";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { CampaignState } from "@reducers/campaignReducer";

import { RootState } from "@reducers/index";

import AuthLayout from "@components/layout/AuthLayout";

import styles from "@styles/perimeter/perimeterLoader.module.scss";
import { t } from "i18next";

const PerimeterLoader = () => {
  const router = useRouter();
  const campaign = useSelector<RootState, CampaignState>(
    state => state.campaign
  );
  const latestcampaign = Object.values(campaign.campaigns).reduce(
    (latest, campaign) => {
      const latestUpdateDate = latest.information?.updatedAt
        ? new Date(latest.information?.updatedAt)
        : new Date("1970-01-01");
      const currentUpdateDate = campaign.information?.updatedAt
        ? new Date(campaign.information?.updatedAt)
        : new Date("1970-01-01");

      return latestUpdateDate > currentUpdateDate ? latest : campaign;
    },
    Object.values(campaign.campaigns)[0]
  );

  const redirectTo = (router.query.redirectTo as string) ?? "campaigns";

  useEffect(() => {
    if (latestcampaign != null && latestcampaign.information) {
      router.replace(`/${redirectTo}/${latestcampaign.information.id}`);
    }
  });

  useEffect(() => {
    if (campaign.allCampaignInformationSet && isEmpty(campaign.campaigns)) {
      router.replace("/no-perimeters");
    }
  });

  return (
    <AuthLayout>
      <div className={styles.perimeterLoader}>
        <div className="spinner-border text-secondary"></div>
        <div className={styles.loadingText}>{upperFirst(t("perimeter.loadingPerimeter"))}</div>
      </div>
    </AuthLayout>
  );
};

export default PerimeterLoader;
