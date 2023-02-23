import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";

import { RootState } from "@reducers/index";

import { useMounted } from "@hooks/utils/useMounted";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";

import { removeCreationError, requestCreation } from "@actions/core/entryTag/entryTagActions";

import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import ClassicModal from "@components/helpers/modal/ClassicModal";

import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateEntryTagModal = ({
  open,
  onClose,
}: Props) => {
  const dispatch = useDispatch();
  const currentPerimeter = useCurrentPerimeter();

  const mounted = useMounted();

  const isCreating = useSelector<RootState, boolean>(state => state.core.entryTag.isCreating);
  const creationError = useSelector<RootState, boolean>(state => state.core.entryTag.creationError);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!open) {
      setName('');
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
          className={cx("field mb-0")}
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
          validateChange={value => value.length <= 20}
        />
      </div>
      <p className={styles.modalIndication}>{upperFirst(t("tag.maxCharacters"))}</p>
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
                })
              );
            }
          }}
        >
          {upperFirst(t("tag.create"))}
        </ButtonSpinner>
      </div>
    </ClassicModal>
  );
};

export default CreateEntryTagModal;
