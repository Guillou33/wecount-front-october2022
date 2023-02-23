import { ProductList } from "@reducers/core/productReducer";
import useAllProducts from "@hooks/core/useAllProducts";

export default function useAllProductList({
  includeArchived = false,
} = {}): ProductList {
  const allProducts = useAllProducts({ includeArchived });

  return allProducts.reduce((productList, product) => {
    productList[product.id] = { ...product };
    return productList;
  }, {} as ProductList);
}
