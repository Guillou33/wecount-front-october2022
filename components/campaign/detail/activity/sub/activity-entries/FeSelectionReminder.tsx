import { useSelector } from "react-redux";
import cx from "classnames";

import { RootState } from "@reducers/index";
import { User } from "@reducers/core/userReducer";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import { Role } from "@custom-types/wecount-api/auth";

import { isGrantedPerimeterRole } from "@lib/core/rolesHierarchy/isGranted";
import { isGrantedRole } from "@lib/core/rolesHierarchy/isGranted";

import ClassicModal from "@components/helpers/modal/ClassicModal";

import styles from "@styles/campaign/detail/activity/sub/activity-entries/feSelectionReminder.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  writerId: number | null;
  remainderAlreadySeen: boolean;
  hasEmptyEf: boolean;
  hasEmptySite: boolean;
  hasEmptyProduct: boolean;
  hasEmptyTags: boolean;
  setAsSeen: () => void;
}

const FeSelectionReminder = ({
  writerId,
  remainderAlreadySeen,
  hasEmptyEf,
  hasEmptySite,
  hasEmptyProduct,
  hasEmptyTags,
  setAsSeen,
}: Props) => {
  const writer = useSelector<RootState, User | null>(state =>
    writerId != null ? state.core.user.userList?.[writerId] : null
  );

  const hasEmptyImportantData =
    hasEmptyEf || hasEmptyProduct || hasEmptySite || hasEmptyTags;

  const isOpened =
    writer !== null &&
    !remainderAlreadySeen &&
    hasEmptyImportantData &&
    !isGrantedPerimeterRole(
      [writer.roleWithinPerimeter ?? PerimeterRole.PERIMETER_ANONYMOUS],
      PerimeterRole.PERIMETER_MANAGER
    ) &&
    !isGrantedRole(writer.roles, Role.ROLE_MANAGER);
  return (
    <ClassicModal open={isOpened} onClose={setAsSeen} small>
      <div className={styles.content}>
        {upperFirst(t("entry.emission.feSelectionReminder"))} :
        <ul className={styles.inputList}>
          {hasEmptyEf && <li>{upperFirst(t("entry.emission.emissionFactor"))}</li>}
          {hasEmptySite && <li>{upperFirst(t("site.site"))}</li>}
          {hasEmptyProduct && <li>{upperFirst(t("product.product"))}</li>}
          {hasEmptyTags && <li>{upperFirst(t("tag.tags"))}</li>}
        </ul>
        {upperFirst(t("entry.user.unauthorizedToWrite"))}.
      </div>
      <button
        className={cx("button-1", styles.confirmButton)}
        onClick={setAsSeen}
      >
        Ok
      </button>
    </ClassicModal>
  );
};

export default FeSelectionReminder;
