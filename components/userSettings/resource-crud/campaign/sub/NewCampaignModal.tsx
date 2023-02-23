import React, { useState } from "react";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import NewCampaignModalStep1 from "./NewCampaignModalStep1";
import NewCampaignModalStep2 from "./NewCampaignModalStep2";
import NewCampaignModalStep3 from "./NewCampaignModalStep3";
import styles from "@styles/userSettings/resource-crud/campaign/sub/newCampaignModal.module.scss";
import cx from "classnames";
import Stepper from "@components/helpers/ui/Stepper";
import { useDispatch } from "react-redux";
import { resetNewCampaignModal } from "@actions/campaign/campaignActions";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

const NewCampaignModal = ({ open, onClose }: Props) => {
  const dispatch = useDispatch();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  const onCloseLocal = () => {
    onClose();
    dispatch(resetNewCampaignModal());
    setStep(1);
  };

  return (
    <ClassicModal open={open} onClose={onCloseLocal}>
      <Stepper
        currentStep={step}
        availableSteps={[
          {
            label: upperFirst(t("campaign.campaignType")),
            stepNumber: 1,
          },
          {
            label: "Template",
            stepNumber: 2,
          },
          {
            label: "Informations",
            stepNumber: 3,
          },
        ]}
      />
      {step === 1 && (
        <NewCampaignModalStep1 
          next={() => setTimeout(() => setStep(2), 0)}
        />
      )}
      {step === 2 && (
        <NewCampaignModalStep2 
          next={() => setTimeout(() => setStep(3), 0)} 
          previous={() => setTimeout(() => setStep(1), 0)}
        />
      )}
      {step === 3 && <NewCampaignModalStep3 
        previous={() => setTimeout(() => setStep(2), 0)}
        onCreated={() => setTimeout(onCloseLocal, 0)} 
      />}
    </ClassicModal>
  );
};

export default NewCampaignModal;
