import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { SearchableFilterName } from "@reducers/filters/filtersReducer";

import useAllProducts from "@hooks/core/useAllProducts";
import useSetOnceProducts from "@hooks/core/reduxSetOnce/useSetOnceProducts";

import FilterElement from "./FilterElement";
import SearchableFilter from "./SearchableFilter";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";
import { toggleSearchableFilterPresence } from "@actions/filters/filtersAction";

import styles from "@styles/filters/filterElement.module.scss";
import { t } from "i18next";
import { upperFirst } from "lodash";

interface Props {
  filterName: SearchableFilterName;
}

const SiteFilter = ({ filterName }: Props) => {
  const dispatch = useDispatch();

  useSetOnceProducts();

  const allProducts = useAllProducts();
  const selectedProducts = useSelector(
    (state: RootState) => state.filters[filterName].elementIds
  );

  const isLongList = allProducts.length > 10;
  const title = upperFirst(t("product.products"));
  return isLongList ? (
    <SearchableFilter
      filterName={filterName}
      ressources={allProducts}
      title={title}
    />
  ) : (
    <FilterElement title={title}>
      <>
        {allProducts.map(product => (
          <CheckboxInput
            id={`${filterName}-${product.id}`}
            key={product.id}
            checked={!!selectedProducts[product.id]}
            onChange={() =>
              dispatch(
                toggleSearchableFilterPresence({
                  filterName: filterName,
                  elementId: product.id,
                })
              )
            }
            className={styles.filter}
            labelClassName={styles.label}
          >
            {product.name}
          </CheckboxInput>
        ))}
      </>
    </FilterElement>
  );
};

export default SiteFilter;
