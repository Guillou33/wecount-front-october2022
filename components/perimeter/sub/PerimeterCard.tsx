import cx from "classnames";
import styles from "@styles/perimeter/sub/perimeterCard.module.scss";
import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { CampaignEmission } from "@reducers/perimeter/perimeterReducer";

import selectAllCampaignsWithEmissions from "@selectors/perimeters/selectAllCampaignsWithEmissions";

import { CampaignStatus, nbrCampaignStatuses } from "@custom-types/core/CampaignStatus";

import StatusList from "./StatusList";

import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  id: number;
  name: string;
  description: string | null;
  nbrCampaignInStatuses: nbrCampaignStatuses;
  isLastPerimeter: boolean;
  onEditClick?: (perimeterId: number) => void;
  onArchiveClick?: (perimeterId: number) => void;
}

const PerimeterCard = ({
  id,
  name,
  description,
  nbrCampaignInStatuses,
  isLastPerimeter,
  onArchiveClick,
  onEditClick,
}: Props) => {
  const campaigns = useSelector<RootState, CampaignEmission[]>(
    state => selectAllCampaignsWithEmissions(state)
  );
  return (
    <div className={styles.perimeterCard}>
      <div className={styles.left}>
        <p className="title-3 color-1 mb-1">{name}</p>
        <p className="mb-0">{description}</p>
        <p className="mb-0" style={{fontWeight: 400}}>{upperFirst(t("campaign.campaigns"))} :</p>
        <StatusList
          campaigns={campaigns.filter(campaign => campaign.perimeterId === id)}
          nbrCampaignInStatuses={nbrCampaignInStatuses} 
        />
      </div>
      <div className={styles.actions}>
        {!isLastPerimeter && (
          <button
            className={cx(styles.button, styles.archiveButton)}
            onClick={() => onArchiveClick && onArchiveClick(id)}
          >
            <i className="fa fa-trash"></i>
          </button>
        )}
        <button
          className={styles.button}
          onClick={() => onEditClick && onEditClick(id)}
        >
          <i className="fa fa-pen color-3"></i>
        </button>
      </div>
    </div>
  );
};

export default PerimeterCard;
