import { useSelector } from "react-redux";
import cx from "classnames";
import { RootState } from "@reducers/index";
import { User } from "@reducers/core/userReducer";
import styles from "@styles/core/userBadge.module.scss";
import useSetOnceUsers from "@hooks/core/reduxSetOnce/useSetOnceUsers";
import { getSomePastel, needsWhiteTextToContrast, Color } from "@lib/utils/hashColor";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import { upperFirst } from "lodash";

interface Props {
  userId: number | null;
  small?: boolean;
  tooltip?: string;
  defaultTooltip?: boolean;
}

const UserBadge = ({ userId, small = false, tooltip, defaultTooltip: defaultTooltip = false }: Props) => {
  useSetOnceUsers();
  const user = useSelector<RootState, User | undefined>(state =>
    userId ? state.core.user.userList[userId] : undefined
  );
  const firstName = user?.profile.firstName ?? "";
  const lastName = user?.profile.lastName ?? "";
  const computedTooltip = defaultTooltip ? getFullName(user ?? null) : tooltip;
  return small ? (
    <SmallBadge firstName={firstName} lastName={lastName} tooltip={computedTooltip}/>
  ) : (
    <Tooltip content={computedTooltip} hideDelay={0} showDelay={0}>
      <div className={styles.userBadge}>
        <SmallBadge firstName={firstName} lastName={lastName}></SmallBadge>
        <span className={styles.userName}>{firstName + " " + lastName}</span>
      </div>
    </Tooltip>
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

export default UserBadge;

interface SmallBadgeProps {
  firstName: string;
  lastName: string;
  tooltip?: string;
}
const SmallBadge = ({ firstName, lastName, tooltip }: SmallBadgeProps) => {
  const fullName = firstName + " " + lastName;
  const initals = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  const backgroundColor = getSomePastel(fullName);
  const contrastText = needsWhiteTextToContrast(backgroundColor);
  return (
    <Tooltip content={tooltip} hideDelay={0} showDelay={0}>
      <div
        className={cx(styles.badge, { [styles.contrastText]: contrastText })}
        style={{ backgroundColor }}
      >
        {initals}
      </div>
    </Tooltip>
  );
};
