import { useSelector } from "react-redux";
import { t } from "i18next";
import cx from "classnames";
import { useState } from "react";
import upperFirst from "lodash/upperFirst";

import { RootState } from "@reducers/index";
import { ProductList } from "@reducers/core/productReducer";

import useSetOnceProducts from "@hooks/core/reduxSetOnce/useSetOnceProducts";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import {
  DefaultContainer,
  SearchContainer,
} from "@components/helpers/ui/selects/selectionContainers";
import Highlight from "@components/helpers/Highlight";

import styles from "@styles/campaign/detail/activity/activityEntries.module.scss";

interface Props {
  selectedProductId: number | null;
  onChange: (productId: number | null) => void;
  selectorClassName?: string;
  className?: string;
  disabled?: boolean;
  canBeModified?: boolean;
  onClickParent?: () => void;
}

const ProductSelector = ({
  selectedProductId,
  onChange,
  selectorClassName,
  className,
  disabled = false,
  canBeModified = true,
  onClickParent,
}: Props) => {
  useSetOnceProducts();

  const products = useSelector<RootState, ProductList>(
    state => state.core.product.productList
  );

  const productWithDefault = [
    ...Object.values(products).filter(product => product.archivedDate === null),
    {
      id: -1,
      name: t("entry.unaffected"),
    },
  ];
  const isLongList = productWithDefault.length > 10;

  // display archived products as "non affectés"
  const productId =
    products[selectedProductId ?? -1]?.archivedDate === null
      ? selectedProductId
      : -1;

  const product = products[selectedProductId ?? -1] ?? undefined;

  const [searchedProduct, setSearchedProduct] = useState("");

  const isListFiltered = isLongList && searchedProduct !== "";

  const productsToRender = isListFiltered
    ? productWithDefault.filter(product =>
        product.name.toLowerCase().includes(searchedProduct.toLowerCase())
      )
    : productWithDefault;

  const renderSelectionContent = () => {
    return (
      <div className={styles.selection}>
        <img
          className={styles.picto}
          src={`/icons/modale/icon-box.svg`}
          alt=""
        />
        <div className={styles.name}>
          {product?.name ?? t("entry.unaffected")}
        </div>
      </div>
    );
  };

  if (!canBeModified) {
    return (
      <div
        onClick={onClickParent}
        className={cx(styles.siteProductTextContainer, className)}
      >
        <img
          className={styles.picto}
          src={`/icons/modale/icon-box.svg`}
          alt=""
        />
        <div className={styles.name}>
          {product?.name ?? t("entry.unaffected")}
        </div>
      </div>
    );
  }

  return (
    <SelectOne
      selected={productId}
      onOptionClick={productId => onChange(productId !== -1 ? productId : null)}
      alignment="center"
      className={selectorClassName}
      renderSelectionContainer={({ children, ...ctx }) =>
        isLongList ? (
          <SearchContainer
            {...ctx}
            searchedValue={searchedProduct}
            setSearchedValue={setSearchedProduct}
            searchInputClassName={styles.searchContainerInput}
          >
            {renderSelectionContent()}
          </SearchContainer>
        ) : (
          <DefaultContainer {...ctx}>
            {renderSelectionContent()}
          </DefaultContainer>
        )
      }
      disabled={disabled}
    >
      {ctx => (
        <>
          {productsToRender.map(product => (
            <Option
              {...ctx}
              value={product.id}
              key={product.id}
              isSelected={product.id === productId}
            >
              {isListFiltered ? (
                <Highlight search={searchedProduct}>{product.name}</Highlight>
              ) : (
                product.name
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
  );
};

export default ProductSelector;
