import { t } from "i18next";
import { upperFirst } from "lodash";
import FeatureMenu from "./FeatureMenu";

const CampaignReportMenu = () => {
  return (
    <FeatureMenu
      title={upperFirst(t("dashboard.dashboard"))}
      icon={<i className="fas fa-tachometer-alt"></i>}
      basePath="campaign-reports"
      subMenu="reports"
    />
  );
};

export default CampaignReportMenu;
