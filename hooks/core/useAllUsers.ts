import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { User, UserList } from "@reducers/core/userReducer";

function useAllUsers({ includeArchived = false } = {}): User[] {
  const userList = useSelector<RootState, UserList>(state => state.core.user.userList);

  const users = Object.values(userList).filter(user => includeArchived || !user.archived);

  return users;
}

export default useAllUsers;
