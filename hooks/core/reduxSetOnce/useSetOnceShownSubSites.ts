import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from '@reducers/index';
import { CustomThunkDispatch } from '@custom-types/redux'
import { setShownAllSubSites } from "@actions/core/site/siteActions";
import _ from "lodash";
import { ShownSubSites, SiteList } from "@reducers/core/siteReducer";
import useAllSiteList from "../useAllSiteList";

const useSetOnceShownSubSites = () => {
  const subSitesSet = useSelector<RootState, boolean>(state => state.core.site.areShown);
  const sites = useAllSiteList();
  const dispatch = useDispatch() as CustomThunkDispatch;

  useEffect(() => {
    if (_.isEmpty(sites) || subSitesSet) return;

    const showSubSites = Object.values(sites).reduce((acc, site) => {
        acc[site.id] = false;
        return acc;
    }, {} as ShownSubSites);
    dispatch(setShownAllSubSites(showSubSites));
  }, [sites])
};

export default useSetOnceShownSubSites;
