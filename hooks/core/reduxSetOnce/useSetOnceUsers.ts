import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from '@reducers/index';
import { CustomThunkDispatch } from '@custom-types/redux'
import { setUsers } from "@actions/core/user/userActions";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";

const useSetOnceUsers = () => {
  const usersSet = useSelector<RootState, boolean>(state => state.core.user.isFetched);
  const dispatch = useDispatch() as CustomThunkDispatch;
  const currentPerimeter = useCurrentPerimeter();

  useEffect(() => {
    if (usersSet || currentPerimeter === null) return;

    dispatch(setUsers(currentPerimeter.id));
  }, [usersSet, currentPerimeter])
};

export default useSetOnceUsers;
