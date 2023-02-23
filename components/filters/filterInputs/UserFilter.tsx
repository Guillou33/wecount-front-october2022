interface Props {}

import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import {
  IdHashMapFilterName,
  PresenceHashMap,
} from "@reducers/filters/filtersReducer";
import { User } from "@reducers/core/userReducer";

import useAllUsers from "@hooks/core/useAllUsers";
import useSetOnceUsers from "@hooks/core/reduxSetOnce/useSetOnceUsers";

import FilterElement from "./FilterElement";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";
import { toggleIdPresence } from "@actions/filters/filtersAction";

import { PerimeterRole, Role } from "@custom-types/wecount-api/auth";
import { isGrantedPerimeterRole } from "@lib/core/rolesHierarchy/isGranted";
import { isGrantedRole } from "@lib/core/rolesHierarchy/isGranted";

import styles from "@styles/filters/filterElement.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

function keepManager(user: User) {
  const userPerimeterRole =
    user.roleWithinPerimeter ?? PerimeterRole.PERIMETER_ANONYMOUS;
  return (
    isGrantedPerimeterRole(
      [userPerimeterRole],
      PerimeterRole.PERIMETER_MANAGER
    ) || isGrantedRole(user.roles, Role.ROLE_MANAGER)
  );
}

interface Props {
  kind: "owner" | "writer";
  filterName: IdHashMapFilterName;
}

const UserFilter = ({ filterName, kind }: Props) => {
  const dispatch = useDispatch();
  useSetOnceUsers();
  const allUsers = useAllUsers();
  const displayUser = kind === "owner" ? keepManager : () => true;
  const displayedUsers = allUsers.filter(displayUser);

  const selectedUsers = useSelector<RootState, PresenceHashMap<number>>(
    state => state.filters[filterName]
  );
  const capitalizedKind = kind.charAt(0).toUpperCase() + kind.slice(1);
  return (
    <FilterElement title={capitalizedKind + "s"}>
      <>
        {displayedUsers.map(user => (
          <CheckboxInput
            id={`${filterName}-${user.id}`}
            key={user.id}
            checked={!!selectedUsers[user.id]}
            onChange={() =>
              dispatch(
                toggleIdPresence({
                  filterName: filterName,
                  elementId: user.id,
                })
              )
            }
            className={styles.filter}
            labelClassName={styles.label}
          >
            {user.profile.firstName + " " + user.profile.lastName}
          </CheckboxInput>
        ))}
        <CheckboxInput
          id={`${filterName}--1`}
          checked={!!selectedUsers[-1]}
          onChange={() =>
            dispatch(
              toggleIdPresence({
                filterName: filterName,
                elementId: -1,
              })
            )
          }
          className={styles.filter}
          labelClassName={styles.label}
        >
          <>
            {upperFirst(t("entry.user.unaffectedTo", {
              // put liaison when language is english 
              determinant: kind === "owner" ? t("global.determinant.undefined.masc.liaison") : 
                t("global.determinant.undefined.masc.masc"), 
                kind: kind
              }))}
          </>
        </CheckboxInput>
      </>
    </FilterElement>
  );
};

export default UserFilter;
