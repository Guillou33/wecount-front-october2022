import useSetOnceUsers from "@hooks/core/reduxSetOnce/useSetOnceUsers";
import useFoldable from "@hooks/utils/useFoldable";
import { RootState } from "@reducers/index";
import { UserList } from "@reducers/core/userReducer";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import { Role } from "@custom-types/wecount-api/auth";
import SiteProductLayout from "@components/userSettings/resource-crud/common/SiteProductLayout";
import EditBox from "@components/userSettings/resource-crud/common/EditBox";
import {
  requestArchive,
  requestUnarchive,
} from "@actions/core/user/userActions";
import { useState } from "react";
import EditUserModal from "@components/userSettings/resource-crud/user/EditUserModal";
import CreateUserModal from "@components/userSettings/resource-crud/user/CreateUserModal";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import DangerConfirmModal from "@components/helpers/modal/DangerConfirmModal";
import { isGrantedRole } from "@lib/core/rolesHierarchy/isGranted";
import {
  getPerimeterRoleName,
  getUserPerimeterRole,
} from "@lib/utils/perimeterRoleUtils";
import styles from "@styles/userSettings/listLayout.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

const User = () => {
  const [editingUserId, setEditingUserId] = useState<number | undefined>(
    undefined
  );
  const [creationModalOpen, setCreationModalOpen] = useState<boolean>(false);

  const [userIdToArchive, setUserIdToArchive] = useState<number | null>(null);

  const {
    isOpen: isOpenArchive,
    toggle: toggleArchive,
    foldable: foldableArchive,
  } = useFoldable(false);

  const dispatch = useDispatch();

  useSetOnceUsers();

  const users = useSelector<RootState, UserList>(
    state => state.core.user.userList
  );

  const currentUserId = useSelector<RootState, number | undefined>(
    state => state.auth.id
  );

  const renderUsers = (active: boolean) => {
    return Object.values(users)
      .filter(user => active === !user.archived)
      .map(user => {
        const isAdmin = isGrantedRole(user.roles, Role.ROLE_MANAGER);
        const onArchiveClick = isAdmin
          ? undefined
          : () => setUserIdToArchive(user.id);

        const onEditClick =
          !isAdmin || user.id === currentUserId
            ? () => setEditingUserId(user.id)
            : undefined;
        const subTitle = getPerimeterRoleName(getUserPerimeterRole(user));
        return (
          <EditBox
            key={user.id}
            title={`${user.profile.firstName} ${user.profile.lastName}`}
            description={user.email}
            isArchived={user.archived}
            archiveClassName="fa-trash"
            subTitle={subTitle}
            onArchiveClick={onArchiveClick}
            onUnarchiveClick={() => {
              dispatch(requestUnarchive(user.id));
            }}
            onEditClick={onEditClick}
          />
        );
      });
  };

  const renderArchivedList = () => {
    return (
      <div className={cx(styles.archivedListContainer)}>
        {renderUsers(false)}
      </div>
    );
  };

  return (
    <SiteProductLayout>
      <div className={cx(styles.container)}>
        <div className={cx(styles.main)}>
          {renderUsers(true)}
          {foldableArchive(renderArchivedList())}
          <ButtonSpinner
            spinnerOn={false}
            onClick={() => setCreationModalOpen(true)}
            className={cx("button-2")}
          >
            + {upperFirst(t("global.add"))}
          </ButtonSpinner>
        </div>
      </div>
      <EditUserModal
        editingUser={!editingUserId ? undefined : users[editingUserId]}
        onClose={() => setEditingUserId(undefined)}
      />
      <CreateUserModal
        open={creationModalOpen}
        onClose={() => setCreationModalOpen(false)}
      />
      <DangerConfirmModal
        small
        open={userIdToArchive != null}
        question={
          <div className="color-1 text-center">
            <p>
              <strong>{upperFirst(t("user.questionDelete"))} ?</strong>
            </p>
          </div>
        }
        btnText={upperFirst(t("global.delete"))}
        onClose={() => setUserIdToArchive(null)}
        onConfirm={() => {
          if (userIdToArchive != null) {
            dispatch(requestArchive(userIdToArchive));
          }
          setUserIdToArchive(null);
        }}
      ></DangerConfirmModal>
    </SiteProductLayout>
  );
};

export default User;
