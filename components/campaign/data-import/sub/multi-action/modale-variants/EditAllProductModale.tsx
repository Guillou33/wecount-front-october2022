import { useDispatch } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useState } from "react";

import { setMappableData } from "@actions/dataImport/entryData/entryDataActions";
import useAllProductList from "@hooks/core/useAllProductList";

import {
  DefaultContainer,
  SearchContainer,
} from "@components/helpers/ui/selects/selectionContainers";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import Highlight from "@components/helpers/Highlight";
import BaseModale from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";

import styles from "@styles/campaign/data-import/sub/multi-actions/modale-variants/editAllProductModale.module.scss";

const EditAllProductModale = () => {
  const dispatch = useDispatch();
  const productList = useAllProductList();
  const allProducts = Object.values(productList);

  const isLongList = allProducts.length > 10;

  const [productId, setProductId] = useState<number | null>(null);
  const [searchedProduct, setSearchProduct] = useState("");

  const isFiltered = isLongList && searchedProduct !== "";

  const productsToRender = isFiltered
    ? allProducts.filter(product =>
        product.name.toLowerCase().includes(searchedProduct.toLowerCase())
      )
    : allProducts;

  const previewProduct = productList[productId ?? -2]?.name;

  return (
    <BaseModale
      renderTitle={count =>
        upperFirst(
          t("dataImport.multiActions.actionTitles.editProduct", { count })
        )
      }
      icon={
        <img
          src={`/icons/modale/icon-box.svg`}
          alt=""
          style={{ transform: "translateY(-3px)" }}
        />
      }
      onApplyButtonClick={entryDataIds => {
        if (productId != null) {
          dispatch(
            setMappableData({
              entryDataIds,
              dataName: "product",
              id: productId,
              entityName: previewProduct ?? "",
            })
          );
        }
      }}
      applyButtonLabel={upperFirst(t("global.modify"))}
      renderControls={
        <SelectOne
          selected={productId}
          onOptionClick={setProductId}
          placeholder={upperFirst(
            t("dataImport.multiActions.actionPlaceholders.chooseProduct")
          )}
          className={styles.productSelector}
          renderSelectionContainer={ctx =>
            isLongList ? (
              <SearchContainer
                {...ctx}
                searchedValue={searchedProduct}
                setSearchedValue={setSearchProduct}
                className={styles.searchInput}
              >
                {productList[productId ?? -2]?.name}
              </SearchContainer>
            ) : (
              <DefaultContainer {...ctx}>
                {productList[productId ?? -2]?.name}
              </DefaultContainer>
            )
          }
        >
          {props => (
            <>
              {productsToRender.map(({ id, name }) => (
                <Option {...props} key={id} value={id}>
                  {isFiltered ? (
                    <Highlight search={searchedProduct}>{name}</Highlight>
                  ) : (
                    name
                  )}
                </Option>
              ))}
              {productsToRender.length === 0 && (
                <div className="font-italic font-weight-light ml-2">
                  {upperFirst(t("global.noResult"))}
                </div>
              )}
            </>
          )}
        </SelectOne>
      }
      previewValues={{
        product: previewProduct,
      }}
    />
  );
};

export default EditAllProductModale;
