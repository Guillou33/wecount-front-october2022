import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from '@reducers/index';
import { CustomThunkDispatch } from '@custom-types/redux'
import { setAuthInfo } from '@actions/auth/authActions';

const useSetOnceAuthInfo = () => {
  const authInfoSet = useSelector<RootState, boolean>(state => !!state.auth.email);
  const dispatch = useDispatch() as CustomThunkDispatch;

  useEffect(() => {
    if (authInfoSet) return;

    dispatch(setAuthInfo());
  }, [])
};

export default useSetOnceAuthInfo;
