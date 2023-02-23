import React, { useMemo } from "react";
import cx from "classnames";
import NewCampaignModalStep from "./NewCampaignModalStep";
import { Option, SelectOne } from "@components/helpers/ui/selects";
import { CampaignType } from "@custom-types/core/CampaignType";
import { getCampaignTypeName } from "@lib/core/campaign/getCampaignTypeName";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import {
  newCampaignUpdateTemplate,
  newCampaignUpdateType,
  newCampaignUpdateWithTemplateValues,
} from "@actions/campaign/campaignActions";
import styles from "@styles/userSettings/resource-crud/campaign/sub/newCampaignModal.module.scss";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { Campaign } from "@reducers/campaignReducer";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  next: () => void;
  previous: () => void;
}

const NewCampaignModalStep2 = ({ next, previous }: Props) => {
  const dispatch = useDispatch();
  const campaignTemplateId = useSelector<RootState, number | undefined>(
    (state) => state.campaign.newCampaign.templateId
  );
  const campaignWithTemplateValues = useSelector<RootState, boolean>(
    (state) => state.campaign.newCampaign.withTemplateValues
  );
  const newCampaignType = useSelector<RootState, CampaignType | undefined>(
    (state) => state.campaign.newCampaign.type
  );
  const campaigns = useSelector<RootState, { [key: number]: Campaign }>(
    (state) => state.campaign.campaigns
  );

  const comment = (
    <p>
      {upperFirst(t("campaign.creationWithTemplate"))}.
    </p>
  );

  return (
    <NewCampaignModalStep title={""} comment={comment}>
      <label className={cx(styles.modalLabel)}>{upperFirst(t("campaign.chooseTemplate"))}</label> 
      {
        newCampaignType === CampaignType.DRAFT && (
          <p className={cx(styles.optionalLabel)}> ({t("global.adjective.optionnal")})</p>
        )
      }
      <div className={cx()}>
        <SelectOne
          className={cx(styles.field)}
          selected={campaignTemplateId ?? (newCampaignType === CampaignType.DRAFT ? 0 : null)}
          onOptionClick={(campaignId) => {
            if (campaignId === 0) {
              dispatch(newCampaignUpdateTemplate(undefined));
            } else {
              dispatch(newCampaignUpdateTemplate(campaignId));
            }
          }}
        >
          {(ctx) => (
            <>
              {
                newCampaignType === CampaignType.DRAFT && (
                  <Option
                    {...ctx}
                    value={0}
                    key={'none'}
                  >
                    <p className={cx(styles.templateSelectorLabel)}>
                      {upperFirst(t("global.none.masc"))}
                    </p>
                  </Option>
                )
              }
              {Object.values(campaigns)
                .filter((campaign) => !!campaign.information && campaign.information.status !== CampaignStatus.ARCHIVED)
                .sort((c1, c2) =>
                  c1.information?.year! <=
                  c2.information?.year!
                    ? -1
                    : 1
                )
                .map((currentCampaign) => {
                  return (
                    <Option
                      {...ctx}
                      value={currentCampaign.information?.id!}
                      key={currentCampaign.information?.id!}
                    >
                      <p className={cx(styles.templateSelectorLabel)}>
                        {currentCampaign?.information?.year!}{" "}
                        {getCampaignTypeName(
                          currentCampaign?.information?.type!
                        )}{" "}
                        - {currentCampaign?.information?.name!}
                      </p>
                    </Option>
                  );
                })}
            </>
          )}
        </SelectOne>
      </div>
      <label className={cx(styles.modalLabel)}>
        <input type="checkbox" disabled={!campaignTemplateId} checked={campaignWithTemplateValues} onChange={() => dispatch(newCampaignUpdateWithTemplateValues(!campaignWithTemplateValues))} />
        &nbsp;{upperFirst(t("campaign.keepValues"))}
      </label>
      <div className={cx(styles.nextPreviousButtonsContainer)}>
        <ButtonSpinner
          onClick={previous}
          type="button"
          className={cx("button-2")}
          disabled={false}
          spinnerOn={false}
        >
          {upperFirst(t("global.back"))}
        </ButtonSpinner>
        <ButtonSpinner
          onClick={next}
          type="button"
          className={cx("button-1")}
          disabled={!campaignTemplateId && newCampaignType !== CampaignType.DRAFT}
          spinnerOn={false}
        >
          {upperFirst(t("global.validate"))}
        </ButtonSpinner>
      </div>
    </NewCampaignModalStep>
  );
};

export default NewCampaignModalStep2;
