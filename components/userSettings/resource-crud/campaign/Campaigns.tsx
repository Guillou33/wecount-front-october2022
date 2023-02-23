import cx from "classnames";
import styles from "@styles/userSettings/resource-crud/campaign/campaigns.module.scss";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteCampaign } from "@actions/campaign/campaignActions";
import { RootState } from "@reducers/index";
import { CampaignInformation, CampaignState } from "@reducers/campaignReducer";
import { SortFields, sortMethods } from "./helpers/sort";
import { useSort } from "@hooks/utils/useSort";
import Campaign from "@components/userSettings/resource-crud/campaign/Campaign";
import DangerConfirmModal from "@components/helpers/modal/DangerConfirmModal";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { upperFirst } from "lodash";
import { t } from "i18next";

const Campaigns = () => {
  const dispatch = useDispatch();
  const [archiveModalOpen, setArchiveModalOpen] = useState(false);
  const [archiveCampaignSpinnerOn, setArchiveCampaignSpinnerOn] = useState(false);
  const [campaignToArchive, setCampaignToArchive] = useState<number | undefined>(undefined);
  const [archivedHidden, setArchivedHidden] = useState(true);
  const { sortField, sortDirAsc, updateSort, sortValues } = useSort<SortFields, CampaignInformation>(SortFields.NAME, sortMethods);
  const campaign = useSelector<RootState, CampaignState>(
    (state) => state.campaign
  );
  const currentPerimeter = useCurrentPerimeter();

  const onArchiveClick = (id: number) => {
    setCampaignToArchive(id);
    setArchiveModalOpen(true)
  }
  const onArchiveModalClose = () => {
    setCampaignToArchive(undefined);
    setArchiveModalOpen(false)
  }
  const onArchiveModalConfirm = () => {
    if (!campaignToArchive) {
      throw new Error("No campaign selected");
    }
    if (currentPerimeter == null) {
      throw new Error("No current perimeter selected");
    }
    setArchiveCampaignSpinnerOn(true);
    dispatch(deleteCampaign(currentPerimeter.id, campaignToArchive, () => {
      setArchiveModalOpen(false);
      setArchiveCampaignSpinnerOn(false);
    }));
  }

  const renderCampaigns = () => {
    const campaignsArray = Object.values(campaign.campaigns).map((campaign) => campaign.information);
    const filteredCampaigns = campaignsArray.filter((campaignInformation) => {
      return !!campaignInformation && (!archivedHidden || campaignInformation.status !== CampaignStatus.ARCHIVED)
    });
    sortValues(filteredCampaigns);

    return filteredCampaigns.map((campaignInformation) => {
      return <Campaign
        onArchiveClick={() => onArchiveClick(campaignInformation!.id)}
        key={campaignInformation!.id}
        id={campaignInformation!.id}
      />;
    });
  }

  const renderHeaderField = (
    name: string,
    sortFieldAssociated: SortFields,
    className?: string
  ) => {
    return (
      <th
        className={cx("header-clickable", className, {
          ["active"]: sortField === sortFieldAssociated,
        })}
        onClick={() => updateSort(sortFieldAssociated)}
      >
        {name}
      </th>
    );
  };
  const renderHeaderFieldUnsortable = (name: string) => {
    return <th>{name}</th>
  }

  return (
    <div className={styles.main}>
      <div className={cx(styles.linkSeeArchivedContainer)}>
        <a
          href="#"
          className={cx(styles.linkSeeArchived)}
          onClick={e => {
            e.preventDefault();
            setArchivedHidden(!archivedHidden);
          }}
        >
          {archivedHidden ? (
            <>
              <i className={cx("fas fa-eye")}></i> {upperFirst(t("campaign.archive.see"))}
            </>
          ) : (
            <>
              <i className={cx("fas fa-eye-slash")}></i> {upperFirst(t("campaign.archive.hide"))}
            </>
          )}
        </a>
      </div>
      <table className={cx("wecount-table", styles.allCampaigns)}>
        <thead>
          <tr>
            {renderHeaderField(upperFirst(t("global.common.name")), SortFields.NAME)}
            {renderHeaderField(upperFirst(t("status.status.singular")), SortFields.STATUS)}
            {renderHeaderField(upperFirst(t("global.common.type")), SortFields.TYPE)}
            {renderHeaderField(upperFirst(t("global.time.year")), SortFields.REFERENCE_YEAR)}
            {renderHeaderField(
              upperFirst(t("campaign.emissionTotalForTrajectory")),
              SortFields.RESULT_TCO2_FOR_TRAJECTORY,
              styles.fixedHeaderWidth
            )}
            {renderHeaderField(upperFirst(t("footprint.emission.totalEmissions")), SortFields.RESULT_TCO2)}
            {renderHeaderFieldUnsortable(upperFirst(t("global.common.actions")))}
          </tr>
        </thead>
        <tbody>{renderCampaigns()}</tbody>
      </table>
      <DangerConfirmModal
        question={`${upperFirst(t("campaign.questionDelete"))} ?`}
        btnText={upperFirst(t("global.confirm"))}
        onConfirm={onArchiveModalConfirm}
        small
        onClose={onArchiveModalClose}
        open={archiveModalOpen}
        spinnerOn={archiveCampaignSpinnerOn}
      ></DangerConfirmModal>
    </div>
  );
}

export default Campaigns;