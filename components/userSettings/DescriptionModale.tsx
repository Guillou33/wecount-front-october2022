import { useSelector, useDispatch } from "react-redux";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import { RootState } from "@reducers/index";
import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import SelfControlledTextarea from "@components/helpers/form/field/SelfControlledTextarea";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { updateDescription } from "@actions/userPreference/activityCategories/activityCategoriesAction";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  activityCategoryId: number | null;
  onClose: () => void;
}

const DescriptionModale = ({ activityCategoryId, onClose }: Props) => {
  const dispatch = useDispatch();
  const currentPerimeter = useCurrentPerimeter();
  const description = useSelector<RootState, string | null>(state =>
    activityCategoryId != null
      ? state.userPreference.activityCategories[activityCategoryId]
          ?.description ?? ""
      : null
  );

  return (
    <ClassicModal open={activityCategoryId != null} onClose={onClose} small>
      <p className={styles.modalLabel}>{upperFirst(t("entry.comment.comment.singular"))}</p>
      <div className="default-field">
        <SelfControlledTextarea
          className="field"
          value={description}
          placeholder={upperFirst(t("entry.comment.comment.singular"))}
          onHtmlChange={(value: string) => {
            if (activityCategoryId != null && currentPerimeter != null) {
              dispatch(updateDescription(currentPerimeter.id, activityCategoryId, value));
            }
          }}
        />
      </div>
      <div className={styles.buttonUpdateContainer}>
        <ButtonSpinner
          spinnerOn={false}
          className="button-1"
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

export default DescriptionModale;
