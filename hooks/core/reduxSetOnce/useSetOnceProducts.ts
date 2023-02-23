import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { RootState } from '@reducers/index';
import { CustomThunkDispatch } from '@custom-types/redux'
import { setProducts } from "@actions/core/product/productActions";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";

const useSetOnceProducts = () => {
  const productsSet = useSelector<RootState, boolean>(state => state.core.product.isFetched);
  const dispatch = useDispatch() as CustomThunkDispatch;
  const currentPerimeter = useCurrentPerimeter();

  useEffect(() => {
    if (productsSet || currentPerimeter == null) return;

    dispatch(setProducts(currentPerimeter.id));
  }, [productsSet, currentPerimeter])
};

export default useSetOnceProducts;
