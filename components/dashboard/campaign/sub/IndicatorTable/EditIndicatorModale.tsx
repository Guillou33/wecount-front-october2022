import { useDispatch } from "react-redux";
import cx from "classnames";
import { requestUpdateIndicator } from "@actions/indicator/indicatorAction";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import styles from "@styles/dashboard/campaign/sub/indicatorTable.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

type IndicatorData = {
  id: number;
  name: string;
  unit: string | null;
  quantity: number | null;
};

type PartialData = Partial<IndicatorData>;

interface Props {
  campaignId: number;
  indicatorData: IndicatorData | null;
  onClose: () => void;
}

const EditIndicatorModale = ({ campaignId, indicatorData, onClose }: Props) => {
  const dispatch = useDispatch();

  const { name = "", quantity = null, unit = null } = indicatorData ?? {};

  const updateIndicator = (data: PartialData) => {
    if (indicatorData !== null) {
      const updateData = {
        ...indicatorData,
        ...data,
        campaignId,
      };
      dispatch(requestUpdateIndicator(updateData));
    }
  };

  return (
    <ClassicModal open={indicatorData !== null} onClose={onClose} small>
      <label htmlFor="indicator-name-edition" className={styles.modalLabel}>
        {upperFirst(t("indicator.nameIndicator"))}
      </label>
      <div className={cx("default-field")}>
        <SelfControlledTextarea
          id="indicator-name-edition"
          className={cx("field")}
          value={name}
          placeholder={upperFirst(t("indicator.nameIndicator"))}
          onHtmlChange={(name: string) => {
            updateIndicator({ name });
          }}
        />
      </div>
      <label htmlFor="indicator-unit-edition" className={styles.modalLabel}>
        {upperFirst(t("global.common.unit"))}
      </label>
      <div className={cx("default-field")}>
        <SelfControlledInput
          id="indicator-unit-edition"
          className={cx("field")}
          value={unit}
          placeholder={t("global.common.unit")}
          onHtmlChange={(unit: string) => {
            updateIndicator({ unit });
          }}
        />
      </div>
      <label htmlFor="indicator-quantity-edition" className={styles.modalLabel}>
        {upperFirst(t("global.common.volume"))}
      </label>
      <div className={cx("default-field")}>
        <SelfControlledInput
          id="indicator-quantity-edition"
          type="number"
          className={cx("field")}
          value={quantity}
          placeholder={t("global.common.volume")}
          onHtmlChange={(value: string) => {
            const parsedQuantity = parseFloat(value);
            updateIndicator({
              quantity: !isNaN(parsedQuantity) ? parsedQuantity : null,
            });
          }}
        />
      </div>
      <div className={styles.validationButtonContainer}>
        <button
          className={cx("button-2")}
          onClick={() => {
            onClose();
          }}
        >
          Ok
        </button>
      </div>
    </ClassicModal>
  );
};

export default EditIndicatorModale;
