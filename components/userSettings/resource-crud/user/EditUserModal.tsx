import {
  requestUpdateFirstName,
  requestUpdateLastName,
  requestUpdatePerimeterRole,
} from "@actions/core/user/userActions";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import ClassicModal from "@components/helpers/modal/ClassicModal";
import { User } from "@reducers/core/userReducer";
import cx from "classnames";
import styles from "@styles/userSettings/resource-crud/modals.module.scss";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import { useDispatch } from "react-redux";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import {
  getPerimeterRoleName,
  assignablePerimeterRoles,
} from "@lib/utils/perimeterRoleUtils";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { Role, PerimeterRole } from "@custom-types/wecount-api/auth";
import { resetOwnerOnAllEntries } from "@actions/entries/campaignEntriesAction";
import { isGrantedRole } from "@lib/core/rolesHierarchy/isGranted";
import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  editingUser: User | undefined;
  onClose: () => void;
}

const EditUserModal = ({ editingUser, onClose }: Props) => {
  const dispatch = useDispatch();
  const currentPerimeter = useCurrentPerimeter();

  const isEditingAnAdmin =
    editingUser != null && isGrantedRole(editingUser.roles, Role.ROLE_MANAGER);

  const isEditingAManager =
    editingUser != null &&
    !isEditingAnAdmin &&
    editingUser.roleWithinPerimeter === PerimeterRole.PERIMETER_MANAGER;

  return (
    <ClassicModal open={!!editingUser} onClose={onClose} small>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("user.account.firstName"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={!editingUser ? "" : editingUser.profile.firstName}
          placeholder={upperFirst(t("user.account.firstName"))}
          onHtmlChange={(value: string) => {
            dispatch(
              requestUpdateFirstName({
                userId: editingUser!.id,
                newFirstName: value,
              })
            );
          }}
        />
      </div>
      <p className={cx(styles.modalLabel)}>{upperFirst(t("user.account.lastName"))}</p>
      <div className={cx("default-field")}>
        <SelfControlledInput
          className={cx("field")}
          value={!editingUser ? "" : editingUser.profile.lastName}
          placeholder={upperFirst(t("user.account.lastName"))}
          onHtmlChange={(value: string) => {
            dispatch(
              requestUpdateLastName({
                userId: editingUser!.id,
                newLastName: value,
              })
            );
          }}
        />
      </div>
      {editingUser != null && !isEditingAnAdmin && (
        <>
          <p className={cx(styles.modalLabel, "mb-1")}>{upperFirst(t("user.role.role"))}</p>
          <p className={styles.modalExplanation}>
            {upperFirst(t("user.addAs.findDescription.part1"))}{" "}
            <a
              target="blank"
              href="https://www.notion.so/wecount/Quels-sont-les-diff-rents-types-d-utilisateurs-cdeeade1718e41e78d01b88820669017"
              className={styles.explanationLink}
            >
              {t("user.addAs.findDescription.part2")}
            </a>
            .
          </p>
          <div className={cx("default-field")}>
            <SelectOne
              selected={editingUser.roleWithinPerimeter ?? null}
              onOptionClick={newRole => {
                if (currentPerimeter != null) {
                  dispatch(
                    requestUpdatePerimeterRole({
                      userId: editingUser.id,
                      perimeterId: currentPerimeter.id,
                      perimeterRole: newRole,
                    })
                  );
                  if (
                    isEditingAManager &&
                    [
                      PerimeterRole.PERIMETER_COLLABORATOR,
                      PerimeterRole.PERIMETER_CONTRIBUTOR,
                    ].includes(newRole)
                    ) {
                    dispatch(resetOwnerOnAllEntries({ ownerId: editingUser.id }));
                  }
                }
              }}
            >
              {ctx => (
                <>
                  {editingUser.roleWithinPerimeter ===
                    PerimeterRole.PERIMETER_MANAGER && (
                    <p
                      className={cx(
                        "alert alert-warning",
                        styles.warningManagerRoleEdition
                      )}
                    >
                      <i
                        className={cx(
                          "fa fa-exclamation-triangle",
                          styles.icon
                        )}
                      ></i>
                      {upperFirst(t("user.role.changeMsg"))}
                    </p>
                  )}
                  {assignablePerimeterRoles.map(role => (
                    <Option {...ctx} value={role} key={role}>
                      {getPerimeterRoleName(role)}
                    </Option>
                  ))}
                </>
              )}
            </SelectOne>
          </div>
        </>
      )}
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

export default EditUserModal;
