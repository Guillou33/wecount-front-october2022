import React, { useState } from 'react';

import MuiStepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

interface Props {
  currentStep: number;
  availableSteps: {
    stepNumber: number;
    label: string;
  }[];
}

const colorActive = '#1B2769';
const colorInactive = '#7d88ca';

const Stepper = ({
  currentStep,
  availableSteps,
}: Props) => {
  const stepLabelCssOverride = {
    '& .MuiSvgIcon-root': {
      color: colorInactive,
    },
    '& .MuiStepIcon-root.Mui-active': {
      color: colorActive,
    },
    '& .MuiStepIcon-root.Mui-completed': {
      color: colorActive,
    },
  };

  return (
    <MuiStepper activeStep={currentStep - 1} alternativeLabel>
      {
        availableSteps.map(step => {
          return (
            <Step key={step.stepNumber}>
              <StepLabel
                sx={stepLabelCssOverride}
              >{step.label}</StepLabel>
            </Step>
          );
        })
      }
    </MuiStepper>
  )
}

export default Stepper;
