import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from '@reducers/index';
import { CustomThunkDispatch } from '@custom-types/redux'
import { setSites } from "@actions/core/site/siteActions";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import { SiteList } from "@reducers/core/siteReducer";
import _ from "lodash";

const useSetOnceSites = () => {
  const siteList = useSelector<RootState, SiteList>(state => state.core.site.siteList);
  const sitesSet = useSelector<RootState, boolean>(state => state.core.site.isFetched);
  const dispatch = useDispatch() as CustomThunkDispatch;
  const currentPerimeter = useCurrentPerimeter();

  useEffect(() => {
    if ((!_.isEmpty(siteList) && sitesSet) || currentPerimeter == null) return;

    dispatch(setSites(currentPerimeter.id));
  }, [sitesSet, currentPerimeter])
};

export default useSetOnceSites;
