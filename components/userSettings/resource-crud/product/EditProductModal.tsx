import { requestUpdateDescription, requestUpdateName, requestUpdateQuantity } from "@actions/core/product/productActions";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import { Product } from "@reducers/core/productReducer";
import cx from "classnames";
import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { useDispatch } from "react-redux";
import { canBeCoercedToNumber } from "@lib/utils/canBeCoercedToNumber";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  editingProduct: Product | undefined;
  onClose: () => void;
}

const EditProductModal = ({
  editingProduct,
  onClose,
}: Props) => {
  const dispatch = useDispatch();

  return (
    <ClassicModal
      open={!!editingProduct}
      onClose={onClose}
      small
    >
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.name"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={!editingProduct ? "" : editingProduct.name}
          placeholder={upperFirst(t("global.common.name"))}
          onHtmlChange={(value: string) => {
            dispatch(
              requestUpdateName({
                productId: editingProduct!.id,
                newName: value,
              })
            );
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.description"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledTextarea
          className={cx("field")}
          value={!editingProduct ? "" : editingProduct.description}
          placeholder={upperFirst(t("global.common.description"))}
          onHtmlChange={(value: string) => {
            dispatch(
              requestUpdateDescription({
                productId: editingProduct!.id,
                newDescription: value,
              })
            );
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.volume"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          validateChange={canBeCoercedToNumber}
          className={cx("field")}
          value={!editingProduct ? "" : editingProduct.quantity}
          placeholder={upperFirst(t("global.common.volume"))}
          onHtmlChange={(value: string) => {
            dispatch(
              requestUpdateQuantity({
                productId: editingProduct!.id,
                newQuantity: value === "" ? null : parseInt(value),
              })
            );
          }}
        />
      </div>
      <div className={cx(styles.buttonUpdateContainer)}>
        <ButtonSpinner
          spinnerOn={false}
          disabled={false}
          className={cx("button-2")}
          onClick={() => {
            onClose();
          }}
        >
          Ok
        </ButtonSpinner>
      </div>
    </ClassicModal>
  );
};

export default EditProductModal;
