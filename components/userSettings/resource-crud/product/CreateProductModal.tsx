import { removeCreationError, requestCreation } from "@actions/core/product/productActions";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import { useMounted } from "@hooks/utils/useMounted";
import { RootState } from "@reducers/index";
import cx from "classnames";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import { canBeCoercedToNumber } from "@lib/utils/canBeCoercedToNumber";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateProductModal = ({
  open,
  onClose,
}: Props) => {
  const dispatch = useDispatch();
  const currentPerimeter = useCurrentPerimeter();

  const mounted = useMounted();

  const isCreating = useSelector<RootState, boolean>(state => state.core.product.isCreating);
  const creationError = useSelector<RootState, boolean>(state => state.core.product.creationError);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState<null | number>(null);

  useEffect(() => {
    if (!open) {
      setName('');
      setDescription('');
      setQuantity(null);
      dispatch(removeCreationError());
    }
  }, [open]);
  
  useEffect(() => {
    if (mounted && !isCreating && !creationError) {
      onClose();
    }
  }, [isCreating]);

  return (
    <ClassicModal
      open={open}
      onClose={onClose}
      small
    >
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.name"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={name}
          placeholder={upperFirst(t("global.common.name"))}
          onHtmlChange={(value: string) => {
            setName(value);
            dispatch(removeCreationError());
          }}
          onLocalChange={(value: string) => {
            if (!name) {
              setName(value);
            }
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.description"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledTextarea
          className={cx("field")}
          value={description}
          placeholder={upperFirst(t("global.common.description"))}
          onHtmlChange={(value: string) => {
            dispatch(removeCreationError());
            setDescription(value);
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.volume"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          validateChange={canBeCoercedToNumber}
          className={cx("field")}
          value={quantity}
          placeholder={upperFirst(t("global.common.volume"))}
          onHtmlChange={(value: string) => {
            setQuantity(value === "" ? null : parseInt(value));
          }}
        />
      </div>
      {
        creationError && (
          <p className={cx("text-danger")}>{upperFirst(t("error.genericError2"))}...</p>
        )
      }
      <div className={cx(styles.buttonCreateContainer)}>
        <ButtonSpinner
          spinnerOn={isCreating}
          disabled={!name}
          className={cx("button-1")}
          onClick={() => {
            if (currentPerimeter != null) {
              dispatch(
                requestCreation({
                  perimeterId: currentPerimeter.id,
                  name,
                  description,
                  quantity,
                })
              );
            }
          }}
        >
          {upperFirst(t("product.create"))}
        </ButtonSpinner>
      </div>
    </ClassicModal>
  );
};

export default CreateProductModal;
