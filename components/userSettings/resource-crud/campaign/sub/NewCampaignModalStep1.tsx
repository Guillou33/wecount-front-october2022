import React from "react";
import cx from "classnames";
import NewCampaignModalStep from "./NewCampaignModalStep";
import { Option, SelectOne } from "@components/helpers/ui/selects";
import { CampaignType } from "@custom-types/core/CampaignType";
import { getCampaignTypeName } from "@lib/core/campaign/getCampaignTypeName";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { newCampaignUpdateType } from "@actions/campaign/campaignActions";
import styles from "@styles/userSettings/resource-crud/campaign/sub/newCampaignModal.module.scss";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  next: () => void;
}

const NewCampaignModalStep1 = ({ next }: Props) => {
  const dispatch = useDispatch();
  const campaignType = useSelector<RootState, CampaignType | undefined>(
    state => state.campaign.newCampaign.type
  );

  const comment = <p>{upperFirst(t("campaign.typeExplanation"))}</p>;

  return (
    <NewCampaignModalStep title={""} comment={comment}>
      {/* <label className={cx()}>Type de campagne</label> */}
      <div className={cx()}>
        <SelectOne
          className={cx(styles.field)}
          selected={campaignType ?? null}
          onOptionClick={campaignType => {
            dispatch(newCampaignUpdateType(campaignType));
          }}
        >
          {ctx => (
            <>
              {[
                CampaignType.CARBON_FOOTPRINT,
                CampaignType.SIMULATION,
                CampaignType.DRAFT,
              ].map(currentCampaignType => (
                <Option
                  {...ctx}
                  value={currentCampaignType}
                  key={currentCampaignType}
                >
                  {getCampaignTypeName(currentCampaignType)}
                </Option>
              ))}
            </>
          )}
        </SelectOne>
      </div>
      <div className={cx(styles.nextPreviousButtonsContainer)}>
        <div></div>
        <ButtonSpinner
          onClick={next}
          type="button"
          className={cx("button-1")}
          disabled={!campaignType}
          spinnerOn={false}
        >
          {upperFirst(t("global.validate"))}
        </ButtonSpinner>
      </div>
    </NewCampaignModalStep>
  );
};

export default NewCampaignModalStep1;
