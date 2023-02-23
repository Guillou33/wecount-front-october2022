import { createSelector } from "reselect";

import { UserList } from "@reducers/core/userReducer";

import { RootState } from "@reducers/index";

const selectUnarchivedUsers = createSelector(
  [(state: RootState) => state.core.user.userList],
  userList => {
    return Object.values(userList).reduce((acc, user) => {
      if (!user.archived) {
        acc[user.id] = user;
      }
      return acc;
    }, {} as UserList);
  }
);

export default selectUnarchivedUsers;