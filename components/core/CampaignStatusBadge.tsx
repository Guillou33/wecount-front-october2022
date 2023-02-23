import cx from "classnames";
import styles from "@styles/core/campaignStatusBadge.module.scss";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { upperFirst } from "lodash";
import { statusReadable } from "@lib/core/campaign/statusReadable";

interface Props {
  status: CampaignStatus;
}

const CampaignStatusBadge = (props: Props) => {
  const statusText = statusReadable(props.status);
  return (
    <div
      className={cx(
        styles.main,
        styles[props.status.toLowerCase()]
      )}
    >
      <p>{upperFirst(statusText)}</p>
    </div>
  );
};

export default CampaignStatusBadge;
