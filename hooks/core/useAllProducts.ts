import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { ProductList, Product } from "@reducers/core/productReducer";
import { upperFirst } from "lodash";
import { t } from "i18next";

function useAllProducts({ includeArchived = false } = {}): Product[] {
  const productList = useSelector<RootState, ProductList>(
    state => state.core.product.productList
  );

  const products = Object.values(productList).filter(
    product => includeArchived || product.archivedDate === null
  );
  const notAffectedProduct: Product = {
    id: -1,
    name: upperFirst(t("product.notAffectedProduct.name")),
    archivedDate: null,
    createdAt: "",
    description: upperFirst(t("product.notAffectedProduct.description")),
    quantity: null,
  };

  return [...products, notAffectedProduct];
}

export default useAllProducts;
