import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";
import styles from "@styles/dashboard/campaign/sub/indicatorTable.module.scss";
import { RootState } from "@reducers/index";

import { requestPerimeterCreation } from "@actions/perimeter/perimeterActions";

import { useMounted } from "@hooks/utils/useMounted";

import ClassicModal from "@components/helpers/modal/ClassicModal";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";

import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreatePerimeterModale = ({ open, onClose }: Props) => {
  const dispatch = useDispatch();

  const mounted = useMounted();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const isCreating = useSelector<RootState, boolean>(
    state => state.perimeter.isCreating
  );

  useEffect(() => {
    if (!open) {
      setName("");
      setDescription("");
    }
  }, [open]);

  useEffect(() => {
    if (mounted && !isCreating) {
      onClose();
    }
  }, [isCreating]);

  return (
    <ClassicModal open={open} onClose={onClose} small>
      <label htmlFor="perimeter-name-creation" className={styles.modalLabel}>
        {upperFirst(t("perimeter.name"))}
      </label>
      <div className={cx("default-field mb-3")}>
        <SelfControlledInput
          id="perimeter-name-creation"
          className={cx("field", styles.noBottomMargin)}
          value={name}
          placeholder={upperFirst(t("perimeter.name"))}
          onHtmlChange={(value: string) => {
            setName(value);
          }}
          onLocalChange={(name: string) => {
            setName(name);
          }}
        />
      </div>

      <label
        htmlFor="perimeter-description-creation"
        className={styles.modalLabel}
      >
        {upperFirst(t("perimeter.description"))}
      </label>
      <div className={cx("default-field")}>
        <SelfControlledTextarea
          id="perimeter-description-creation"
          className={cx("field")}
          value={description}
          placeholder={upperFirst(t("perimeter.description"))}
          onHtmlChange={(value: string) => {
            setDescription(value);
          }}
        />
      </div>

      <div className={styles.validationButtonContainer}>
        <ButtonSpinner
          spinnerOn={isCreating}
          disabled={!name}
          className={cx("button-1")}
          onClick={() => {
            dispatch(requestPerimeterCreation({ name, description: description ?? null }));
          }}
        >
          {upperFirst(t("perimeter.create"))}
        </ButtonSpinner>
      </div>
    </ClassicModal>
  );
};

export default CreatePerimeterModale;
