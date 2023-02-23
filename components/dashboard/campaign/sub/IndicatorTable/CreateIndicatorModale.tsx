import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import { RootState } from "@reducers/index";
import { requestCreateIndicator } from "@actions/indicator/indicatorAction";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { useMounted } from "@hooks/utils/useMounted";
import styles from "@styles/dashboard/campaign/sub/indicatorTable.module.scss";
import helpTexts from "./modaleHelpTexts";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  campaignId: number;
  open: boolean;
  onClose: () => void;
}

const CreateIndicatorModale = ({ campaignId, open, onClose }: Props) => {
  const dispatch = useDispatch();

  const mounted = useMounted();

  const [name, setName] = useState("");
  const [unit, setUnit] = useState("");
  const [quantity, setQuantity] = useState<number | null>(null);

  const isCreating = useSelector<RootState, boolean>(
    state => state.indicator[campaignId].isCreating
  );

  useEffect(() => {
    if (!open) {
      setName("");
      setUnit("");
      setQuantity(null);
    }
  }, [open]);

  useEffect(() => {
    if (mounted && !isCreating) {
      onClose();
    }
  }, [isCreating]);

  return (
    <ClassicModal open={open} onClose={onClose} small>
      <label htmlFor="indicator-name-creation" className={styles.modalLabel}>
        {upperFirst(t("indicator.nameIndicator"))}
      </label>
      <div className={cx("default-field")}>
        <SelfControlledTextarea
          id="indicator-name-creation"
          className={cx("field", styles.noBottomMargin)}
          value={name}
          placeholder={upperFirst(t("indicator.nameIndicator"))}
          onHtmlChange={(value: string) => {
            setName(value);
          }}
          onLocalChange={(name: string) => {
            setName(name);
          }}
        />
      </div>
      <p className={styles.modaleHelpText}>{helpTexts.name}</p>
      <p className={cx(styles.modaleExampleText)}>{helpTexts.nameExample}</p>

      <label htmlFor="indicator-unit-creation" className={styles.modalLabel}>
        {upperFirst(t("global.common.unit"))}
      </label>
      <div className={cx("default-field")}>
        <SelfControlledInput
          id="indicator-unit-creation"
          className={cx("field", styles.noBottomMargin)}
          value={unit}
          placeholder={t("global.common.unit")}
          onHtmlChange={(value: string) => {
            setUnit(value);
          }}
        />
      </div>
      <p className={cx("form-text", styles.modaleHelpText)}>{helpTexts.unit}</p>
      <p className={cx(styles.modaleExampleText)}>{helpTexts.unitExample}</p>

      <label
        htmlFor="indicator-quantity-creation"
        className={styles.modalLabel}
      >
        {upperFirst(t("global.common.volume"))}
      </label>
      <div className={cx("default-field")}>
        <SelfControlledInput
          id="indicator-quantity-creation"
          type="number"
          className={cx("field", styles.noBottomMargin)}
          value={quantity}
          placeholder={t("global.common.volume")}
          onHtmlChange={(value: string) => {
            setQuantity(parseFloat(value));
          }}
        />
      </div>
      <p className={cx("form-text", styles.modaleHelpText)}>
        {helpTexts.quantity}
      </p>
      <p className={cx(styles.modaleExampleText)}>
        {helpTexts.quantityExample}
      </p>

      <p className={cx("form-text", styles.modaleHelpText)}>{helpTexts.info}</p>
      <p className={cx(styles.modaleExampleText)}>{helpTexts.infoExample}</p>
      <div className={styles.validationButtonContainer}>
        <ButtonSpinner
          spinnerOn={isCreating}
          disabled={!name}
          className={cx("button-1")}
          onClick={() => {
            dispatch(requestCreateIndicator(campaignId, name, unit, quantity));
          }}
        >
          {upperFirst(t("indicator.createIndicator"))} 
        </ButtonSpinner>
      </div>
    </ClassicModal>
  );
};

export default CreateIndicatorModale;
