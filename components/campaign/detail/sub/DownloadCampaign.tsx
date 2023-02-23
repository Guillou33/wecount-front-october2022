import fileDownload from "js-file-download";
import cx from "classnames";
import ApiClient from "@lib/wecount-api/ApiClient";
import { ApiRoutes, generateRoute } from "@lib/wecount-api/routes/apiRoutes";
import styles from "@styles/campaign/detail/sub/downloadCampaign.module.scss";

interface Props {
  campaignId: number;
}

const DownloadCampaign = ({ campaignId }: Props) => {
  const onDownloadClick = async () => {
    const apiClient = ApiClient.buildFromBrowser();

    const response = await apiClient.get<string>(
      generateRoute(ApiRoutes.CSV_EXPORT, {
        campaignId,
      })
    );

    const date = new Date();
    const csvName = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}_campagne_${campaignId}.csv`;
    fileDownload(response.data, csvName);
  };
  return (
    <button
      className={cx("button-1", styles.downloadButton)}
      onClick={onDownloadClick}
    >
      <i className="fas fa-download"></i>
    </button>
  );
};

export default DownloadCampaign;
