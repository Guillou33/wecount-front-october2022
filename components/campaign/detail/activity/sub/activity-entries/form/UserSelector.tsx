import cx from "classnames";
import useSetOnceUsers from "@hooks/core/reduxSetOnce/useSetOnceUsers";
import { RootState } from "@reducers/index";
import { UserList, User } from "@reducers/core/userReducer";
import { useSelector } from "react-redux";
import styles from "@styles/campaign/detail/activity/sub/activity-entries/form/userSelector.module.scss";
import { upperFirst } from "lodash";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import { GhostContainer } from "@components/helpers/ui/selects/selectionContainers";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import UserBadge from "@components/core/UserBadge";
import { t } from "i18next";

interface Props {
  selectedUserId: number | null;
  onChange: (userId: number | null) => void;
  tooltipBase?: string;
  className?: string;
  filterShowedUsers?: (user: User) => boolean;
  disabled?: boolean;
}

const UserSelector = ({
  selectedUserId,
  onChange,
  tooltipBase,
  className: parentClassName = "",
  filterShowedUsers = () => true,
  disabled = false,
}: Props) => {
  useSetOnceUsers();

  const userList = useSelector<RootState, UserList>(
    state => state.core.user.userList
  );
  const users = Object.values(userList).filter(
    user => !user.archived && filterShowedUsers(user)
  );

  const selectedUser = selectedUserId != null ? userList[selectedUserId] : null;

  return (
    <SelectOne
      selected={selectedUserId}
      onOptionClick={userId => onChange(userId !== -1 ? userId : null)}
      renderSelectionContainer={ctx => (
        <GhostContainer
          {...ctx}
          className={cx(styles.selectedUserContainer, {
            [styles.disabled]: ctx.disabled,
          })}
        >
          {selectedUserId != null ? (
            <UserBadge
              userId={selectedUserId}
              small
              tooltip={`${tooltipBase}: ${getFullName(selectedUser)}`}
            />
          ) : (
            <Tooltip
              content={
                ctx.disabled
                  ? `${tooltipBase} ${t("entry.user.undefined")}`
                  : `${upperFirst(t("global.assign"))} ${t("global.determinant.defined.masc")} ${tooltipBase}`
              }
              hideDelay={0}
              showDelay={0}
            >
              <div
                className={cx(styles.userPlaceholder, {
                  [styles.disabled]: ctx.disabled,
                })}
              >
                <i
                  className={cx("fa", {
                    ["fa-user-plus"]: !ctx.disabled,
                    ["fa-user"]: ctx.disabled,
                  })}
                ></i>
              </div>
            </Tooltip>
          )}
        </GhostContainer>
      )}
      alignment="right"
      className={styles.userSelector}
      disabled={disabled}
    >
      {ctx => (
        <>
          {users.map(user => (
            <Option {...ctx} value={user.id} key={user.id}>
              <div className={styles.userOption}>
                <UserBadge userId={user.id} small />{" "}
                <div className={styles.fullName}>{getFullName(user)}</div>
              </div>
            </Option>
          ))}
          <Option {...ctx} value={-1} key={-1}>
            <div className={styles.userOption}>
              <div className={styles.userPlaceholder}>
                <i className="fa fa-user-minus"></i>
              </div>
              <div className={styles.fullName}>{upperFirst(t("entry.user.unassigned"))}</div>
            </div>
          </Option>
        </>
      )}
    </SelectOne>
  );
};

function getFullName(user: User | null): string {
  if (user === null) {
    return "";
  }
  return (
    upperFirst(user?.profile?.firstName ?? "") + " " + upperFirst(user?.profile?.lastName ?? "")
  );
}

export default UserSelector;
