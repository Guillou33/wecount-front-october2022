import { useDispatch, useSelector } from "react-redux";
import { RootState } from '@reducers/index';
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { requestFetchCustomEmissionFactors } from "@actions/core/customEmissionFactor/customEmissionFactorActions";
import { useEffect } from "react";

const useSetCustomEmissionFactors = () => {
  const cefFetched = useSelector<RootState, boolean>(state => state.core.customEmissionFactor.isFetched);
  const cefFetching = useSelector<RootState, boolean>(state => state.core.customEmissionFactor.isFetching);
  const dispatch = useDispatch();
  const currentPerimeter = useCurrentPerimeter();

  const fetchIfNeeded = () => {
    if (!cefFetched && !cefFetching && currentPerimeter) {
      dispatch(requestFetchCustomEmissionFactors());
    }
  };

  useEffect(() => {
    fetchIfNeeded();
  }, [currentPerimeter]);

  return;
};

export default useSetCustomEmissionFactors;
