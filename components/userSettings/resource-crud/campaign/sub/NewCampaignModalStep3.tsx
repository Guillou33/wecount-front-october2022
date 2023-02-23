import React, { useState } from "react";
import cx from "classnames";
import NewCampaignModalStep from "./NewCampaignModalStep";
import { Option, SelectOne, YearPicker } from "@components/helpers/ui/selects";
import { CampaignType } from "@custom-types/core/CampaignType";
import { getCampaignTypeName } from "@lib/core/campaign/getCampaignTypeName";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import {
  create,
  newCampaignUpdateName,
  newCampaignUpdateTemplate,
  newCampaignUpdateType,
  newCampaignUpdateYear,
} from "@actions/campaign/campaignActions";
import styles from "@styles/userSettings/resource-crud/campaign/sub/newCampaignModal.module.scss";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { Campaign, NewCampaign } from "@reducers/campaignReducer";
import selectUnavailableYears from "@selectors/campaign/selectUnavailableYears";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { useRouter } from "next/router";
import { RouteCampaignGenerator } from "@custom-types/core/routes";
import InputAddon from "@components/helpers/form/field/InputAddon";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  previous: () => void;
  onCreated: () => void;
}

const NewCampaignModalStep3 = ({
  previous,
  onCreated
}: Props) => {
  const dispatch = useDispatch();

  const router = useRouter();
  const currentPerimeter = useCurrentPerimeter()!;
  const newCampaign = useSelector<RootState, NewCampaign>(
    (state) => state.campaign.newCampaign
  );
  const campaignYear = newCampaign.year;
  const campaignType = newCampaign.type!;
  const unavailableYears = useSelector(
    (state: RootState) => selectUnavailableYears(state)[campaignType]
  );
  const [addCampaignSpinnerOn, setAddCampaignSpinnerOn] = useState(false);

  const addCampaign = () => {
    if (newCampaign.name && campaignYear == null && campaignType == null && newCampaign.templateId == null) {
      return
    }
    setAddCampaignSpinnerOn(true);
    dispatch(
        create({
          perimeterId: currentPerimeter?.id,
          year: campaignYear!,
          type: campaignType!,
          campaignTemplateId: newCampaign.templateId!,
          withTemplateValues: newCampaign.withTemplateValues,
          name: newCampaign.name!,
        }, campaignId => {
            setAddCampaignSpinnerOn(false);
            onCreated();
            router.push(
                RouteCampaignGenerator.path,
                RouteCampaignGenerator.generate(campaignId)
            );
        })
    );
  };

  const comment = (
    <p>
      {upperFirst(t("campaign.availableYearsForCampaigntype"))}.
    </p>
  );

  return (
    <NewCampaignModalStep
      title={""}
      comment={comment}
    >
      <label className={cx(styles.modalLabel)}>{upperFirst(t("campaign.campaignName"))}</label>
      <InputAddon
        className={cx(styles.field)}
        value={newCampaign.name}
        onLocalChange={(name: string) => dispatch(newCampaignUpdateName(name))}
        inputClassName={styles.nameInput}
        placeholder={upperFirst(t("campaign.campaignName"))}
      />
      <label className={cx(styles.modalLabel)}>
        {upperFirst(t("campaign.campaignYear"))}
      </label>
      <YearPicker
        className={cx(styles.field)}
        selected={campaignYear ?? null}
        onOptionClick={(year) => dispatch(newCampaignUpdateYear(year))}
        placeholder={upperFirst(t("campaign.campaignYear"))}
        disableYear={(year) => unavailableYears?.indexOf(year) !== -1}
      />
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
        <ButtonSpinner onClick={addCampaign} type="button" className={cx("button-1")} disabled={!campaignYear || !newCampaign.name} spinnerOn={addCampaignSpinnerOn}>
          {upperFirst(t("global.validate"))}
        </ButtonSpinner>
      </div>
    </NewCampaignModalStep>
  );
};

export default NewCampaignModalStep3;
