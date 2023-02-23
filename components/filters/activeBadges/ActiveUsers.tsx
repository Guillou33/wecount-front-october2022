import { useDispatch, useSelector } from "react-redux";

import useUserList from "@hooks/core/useUserList";
import {
  IdHashMapFilterName,
  PresenceHashMap,
} from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";
import ActiveFilterBadge from "./ActiveFilterBadge";

import { toggleIdPresence } from "@actions/filters/filtersAction";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  kind: "owner" | "writer";
  filterName: IdHashMapFilterName;
}

const ActiveUsers = ({ filterName, kind }: Props) => {
  const dispatch = useDispatch();

  const allUserList = useUserList();
  const selectedUsers = useSelector<RootState, PresenceHashMap<number>>(
    state => state.filters[filterName]
  );

  const capitalizedKind = kind.charAt(0).toUpperCase() + kind.slice(1);

  return (
    <>
      {Object.keys(selectedUsers).map(userId => (
        <ActiveFilterBadge
          key={userId}
          onRemoveClick={() =>
            dispatch(
              toggleIdPresence({
                filterName,
                elementId: Number(userId),
              })
            )
          }
        >
          <>
            <i className="mr-1 far fa-user small" />
            {userId === "-1"
              ? `${upperFirst(t("entry.user.unaffectedTo", {
                  // put liaison when language is english 
                  determinant: kind === "owner" ? t("global.determinant.undefined.masc.liaison") : 
                    t("global.determinant.undefined.masc.masc"), 
                    kind: kind
                  }))}`
              : `${capitalizedKind} : ${allUserList[Number(userId)]?.profile.firstName} ${
                  allUserList[Number(userId)]?.profile.lastName
                }`}
          </>
        </ActiveFilterBadge>
      ))}
    </>
  );
};

export default ActiveUsers;
