import { createSelector } from "reselect";

import { getHashMap } from "@lib/utils/getNameHashMap";

import { RootState } from "@reducers/index";

const selectAllUsersByName = createSelector(
  [(state: RootState) => state.core.user.userList],
  users => getHashMap(Object.values(users), "email")
);

export default selectAllUsersByName;
