import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { UserList } from "@reducers/core/userReducer";

import useSetOnceUsers from "@hooks/core/reduxSetOnce/useSetOnceUsers";

function useUserList(): UserList {
  useSetOnceUsers();

  const userList = useSelector<RootState, UserList | undefined>(
    state => state.core.user.userList
  );

  return userList ?? {};
}

export default useUserList;
