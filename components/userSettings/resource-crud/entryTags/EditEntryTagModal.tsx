import { requestUpdateEntryTag } from "@actions/core/entryTag/entryTagActions";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import { useDispatch } from "react-redux";
import cx from "classnames";

import { EntryTagResponse } from "@lib/wecount-api/responses/apiResponses";

import ClassicModal from "@components/helpers/modal/ClassicModal";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";

import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  editingEntryTag: EntryTagResponse | undefined;
  onClose: () => void;
}

const EditEntryTagModal = ({
  editingEntryTag,
  onClose,
}: Props) => {
  const dispatch = useDispatch();

  return (
    <ClassicModal
      open={!!editingEntryTag}
      onClose={onClose}
      small
    >
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.name"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field mb-0")}
          value={!editingEntryTag ? "" : editingEntryTag.name}
          placeholder={upperFirst(t("global.common.name"))}
          onHtmlChange={(value: string) => {
            dispatch(
              requestUpdateEntryTag({
                entryTagId: editingEntryTag!.id,
                newName: value,
              })
            );
          }}
          validateChange={value => value.length <= 20}
        />
      </div>
      <p className={styles.modalIndication}>{upperFirst(t("tag.maxCharacters"))}</p>
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

export default EditEntryTagModal;
