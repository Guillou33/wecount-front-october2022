import { useDispatch } from "react-redux";
import { startEdit } from "@actions/activity/edit/editActions";
import styles from "@styles/campaign/detail/dashboard/activityAddButton.module.scss";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  activityModelId: number;
}

const AddButton = ({ activityModelId }: Props) => {
  const dispatch = useDispatch();
  const withReadOnlyAccessControl = useReadOnlyAccessControl();

  return (
    <div
      onClick={withReadOnlyAccessControl(() =>
        dispatch(
          startEdit({
            activityModelId,
          })
        )
      )}
      className={styles.container}
    >
      <div className={styles.main}>
        <p className={styles.activityName}>{upperFirst(t("activity.new"))}</p>
        <img className={styles.plusSign} src="/icons/plus-sign.svg" alt="" />
      </div>
    </div>
  );
};

export default AddButton;
