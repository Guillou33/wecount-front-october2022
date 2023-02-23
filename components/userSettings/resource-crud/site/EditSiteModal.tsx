import { requestUpdateDescription, requestUpdateName } from "@actions/core/site/siteActions";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import { Site } from "@reducers/core/siteReducer";
import cx from "classnames";
import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { useDispatch, useSelector } from "react-redux";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { RootState } from "@reducers/index";

interface Props {
  editingSite: Site | undefined;
  onClose: () => void;
}

const EditSiteModal = ({
  editingSite,
  onClose,
}: Props) => {

  const dispatch = useDispatch();
  const isEditing = useSelector<RootState, boolean>(state => state.core.site.siteEdit.isEditing);

  return (
    <ClassicModal
      open={!!editingSite}
      onClose={onClose}
      small
    >
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.name"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={!editingSite ? "" : editingSite.name}
          placeholder={upperFirst(t("global.common.name"))}
          onHtmlChange={(value: string) => {
            if(editingSite !== undefined){
              dispatch(
                requestUpdateName({
                  siteId: editingSite!.id,
                  newName: value,
                })
              );
            }
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("global.common.description"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledTextarea
          className={cx("field")}
          value={!editingSite ? "" : editingSite.description}
          placeholder={upperFirst(t("global.common.description"))}
          onHtmlChange={(value: string) => {
            if(editingSite !== undefined){
              dispatch(
                requestUpdateDescription({
                  siteId: editingSite!.id,
                  newDescription: value,
                })
              );
            }
          }}
        />
      </div>
      <div className={cx(styles.buttonCreateContainer)}>
        <ButtonSpinner
          spinnerOn={isEditing}
          className={cx("button-1")}
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

export default EditSiteModal;
