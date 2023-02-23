import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from '@reducers/index';
import { CustomThunkDispatch } from '@custom-types/redux'
import _ from "lodash";
import useAllSiteList from "../useAllSiteList";
import useAllProductList from "../useAllProductList";
import { setMultipleSelection } from "@actions/core/selection/coreSelectionActions";

const useSetOnceCoreSelectionList = (sectionName: string) => {
  const sitesSet = useSelector<RootState, boolean>(state => state.core.site.isFetched);
  const productsSet = useSelector<RootState, boolean>(state => state.core.product.isFetched);

  const isCoreSiteSelectFilled = useSelector<RootState, boolean>(state => state.coreSelection.isCoreSiteSelect);
  const isCoreProductSelectFilled = useSelector<RootState, boolean>(state => state.coreSelection.isCoreProductSelect);

  const sites = useAllSiteList({
    includeArchived: true,
    includeSubSites: true,
  });
  const products = useAllProductList({
    includeArchived: true,
  });

  const dispatch = useDispatch() as CustomThunkDispatch;

  useEffect(() => {
    if (
      (!sitesSet && !productsSet) || 
      (isCoreSiteSelectFilled && isCoreProductSelectFilled)
    ) return;

    const checkSites: Record<number, boolean> = Object.values(sites).reduce((acc, site) => {
      acc[site.id] = false;
      return acc;
    }, {} as Record<number, boolean>);

    const checkProducts: Record<number, boolean> = Object.values(products).reduce((acc, product) => {
      acc[product.id] = false;
      return acc;
    }, {} as Record<number, boolean>);

    const checkCores: Record<string, {
      check: Record<number, boolean>,
      isFilled: boolean
    }> = {
      ["site"]: {
        check: checkSites,
        isFilled: sitesSet
      },
      ["product"]: {
        check: checkProducts,
        isFilled: productsSet
      },
    }
    
    if(checkCores[sectionName].isFilled){
      dispatch(setMultipleSelection({
        [sectionName]: checkCores[sectionName].check
      }));
    }

  }, [sitesSet, productsSet])
};

export default useSetOnceCoreSelectionList;
