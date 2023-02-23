import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from "@reducers/index";
import { ScopeHelpsState } from "@reducers/core/scopeHelpsReducer";
import { CustomThunkDispatch } from "@custom-types/redux";
import { fetchScopeHelps } from "@actions/core/scopeHelps/scopeHelpsActions";

const useSetOnceScopeHelps = () => {
  const scopeHelps = useSelector<RootState, ScopeHelpsState>(
    state => state.core.scopeHelps
  );
  const dispatch = useDispatch() as CustomThunkDispatch;

  const helpsFetched = Object.values(scopeHelps).every(help => help != null);

  useEffect(() => {
    if (helpsFetched) return;

    dispatch(fetchScopeHelps());
  }, []);
};

export default useSetOnceScopeHelps;
