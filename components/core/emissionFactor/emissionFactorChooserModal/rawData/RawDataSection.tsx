import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import { upperFirst } from "lodash";
import useTranslate from "@hooks/core/translation/useTranslate";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { useDispatch } from "react-redux";
import { setModalOpen, updateLastChoice } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";

const RawDataSection = () => {
  const t = useTranslate();
  const dispatch = useDispatch();

  const onValidate = () => {
    dispatch(updateLastChoice({}))
    dispatch(setModalOpen(false));
  }

  return (
    <div className={cx(styles.section)}>
      <p className={styles.title}>
        {upperFirst(t("entry.computeMethod.insertRawData"))}
      </p>
      <div className={cx(styles.validateButtonContainer)}>
        <ButtonSpinner className="button-1"  onClick={onValidate} spinnerOn={false}>
          {upperFirst(t("global.validate"))}
        </ButtonSpinner>
      </div>
    </div>
  );
};

export default RawDataSection;
