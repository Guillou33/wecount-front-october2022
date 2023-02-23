import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";
import { updateActivityModelVisibility } from "@actions/userPreference/activityModels/activityModelsActions";
import { Scope } from "@custom-types/wecount-api/activity";
import Switch from "@components/helpers/ui/Switch";
import styles from "@styles/userSettings/activityModel.module.scss";
import PrivateBadge from "@components/core/PrivateBadge";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { t } from "i18next";

interface Props {
  id: number;
  uniqueName: string;
  name: string;
  scope: Scope;
  isVisible: boolean;
  activityEntries: number;
  preferencesFetched: boolean;
  isPrivate: boolean;
}

const ActivityModel = ({
  id,
  uniqueName,
  name,
  scope,
  isVisible,
  activityEntries,
  preferencesFetched,
  isPrivate
}: Props) => {
  const dispatch = useDispatch();
  const currentPerimeter = useCurrentPerimeter();

  const scopeClassName = scope.toLowerCase();
  const updatePreference = (uniqueName: string, isVisible: boolean) => {
    if (preferencesFetched && currentPerimeter != null) {
      dispatch(updateActivityModelVisibility(currentPerimeter.id, uniqueName, isVisible));
    }
  };
  return (
    <div
      className={cx(styles.activityModel, styles[scopeClassName], {
        [styles.greyedOut]: !isVisible,
        [styles.clickDisabled]: !preferencesFetched,
      })}
      onClick={() => updatePreference(uniqueName, !isVisible)}
    >
      <div className={styles.activityModelName}>
        {name.toLocaleUpperCase()}
        {isPrivate && <PrivateBadge />}
      </div>
      <div className={styles.leftBlock}>
        {activityEntries > 0 && (
          <div className={cx("badge badge-secondary", styles.activityBadge)}>
            {!isVisible && <i className="fa fa-exclamation-triangle"></i>}
            <span className={styles.activityBadgeText}>
              {`${activityEntries} ${activityEntries > 1 ? t("activity.activities") : t("activity.activity")}`}
            </span>
          </div>
        )}
        <Switch
          className={styles.switch}
          checked={isVisible}
          name={uniqueName}
          onChange={(checked, uniqueName) => {
            updatePreference(uniqueName ?? "", checked);
          }}
          activeClassName={styles.switchActive}
        />
      </div>
    </div>
  );
};

export default ActivityModel;
