import cx from "classnames";
import Header from "./Header";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import ComputeMethodChooser from "./computeMethod/ComputeMethodChooser";
import TagColumn from "./tagColumn/TagColumn";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { useInitCurrentData } from "./hooks/useInitCurrentData";
import EmissionFactorSection from "./emissionFactor/EmissionFactorSection";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import RawDataSection from "./rawData/RawDataSection";
import CustomEFSection from "./customEmissionFactor/CustomEFSection";
import { useEffect } from "react";
import { setTagColumnOpen } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";

interface Props {
  onClose: () => void;
}

const EmissionFactorChooserModal = ({ onClose }: Props) => {
  const dispatch = useDispatch();

  useInitCurrentData();
  const dataInited = useSelector<RootState, boolean>(
    (state) => state.emissionFactorChoice.currentDataInited
  );

  const tagColumnOpen = useSelector<RootState, boolean>(state => state.emissionFactorChoice.tagColumnOpen);
  const currentComputeMethodType = useSelector<RootState, ComputeMethodType | undefined>(state => state.emissionFactorChoice.currentComputeMethodType);

  useEffect(() => {
    if (currentComputeMethodType !== ComputeMethodType.STANDARD) {
      dispatch(setTagColumnOpen(false));
    }
  }, [currentComputeMethodType]);
  
  const innerModal = (
    <>
      {tagColumnOpen && currentComputeMethodType === ComputeMethodType.STANDARD && <TagColumn />}
      <div className={cx(styles.mainColumn)}>
        <Header onClose={onClose} />
        <ComputeMethodChooser />
        {currentComputeMethodType === ComputeMethodType.STANDARD && <EmissionFactorSection />}
        {currentComputeMethodType === ComputeMethodType.RAW_DATA && <RawDataSection />}
        {currentComputeMethodType === ComputeMethodType.CUSTOM_EMISSION_FACTOR && <CustomEFSection/>}
      </div>
    </>
  );
  return (
    <div className={cx(styles.mainModal)}>
      {dataInited && innerModal}
    </div>
  );
};

export default EmissionFactorChooserModal;
