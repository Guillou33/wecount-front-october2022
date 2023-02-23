import useSetOnceProducts from "@hooks/core/reduxSetOnce/useSetOnceProducts";
import useFoldable from "@hooks/utils/useFoldable";
import { RootState } from "@reducers/index";
import { ProductList } from "@reducers/core/productReducer";
import cx from "classnames";
import { useDispatch, useSelector } from "react-redux";
import SiteProductLayout from "@components/userSettings/resource-crud/common/SiteProductLayout";
import EditBox from "@components/userSettings/resource-crud/common/EditBox";
import {
  requestArchive,
  requestUnarchive,
} from "@actions/core/product/productActions";
import { useState } from "react";
import EditProductModal from "@components/userSettings/resource-crud/product/EditProductModal";
import CreateProductModal from "@components/userSettings/resource-crud/product/CreateProductModal";
import { ButtonSpinner } from "@components/helpers/form/button/Buttons";
import styles from "@styles/userSettings/listLayout.module.scss";
import useReadOnlyAccessControl from "@hooks/core/readOnlyMode/useReadOnlyAccessControl";
import { t } from "i18next";
import { upperFirst } from "lodash";
import useSetOnceCoreSelectionList from "@hooks/core/reduxSetOnce/useSetOnceCoreSelectionList";
import { setProductSelection } from "@actions/core/selection/coreSelectionActions";
import SiteProductCheckbox from "../common/SiteProductCheckbox";

const Product = () => {
  useSetOnceProducts();
  const withReadOnlyAccessControl = useReadOnlyAccessControl();

  const [editingProductId, setEditingProductId] = useState<number | undefined>(
    undefined
  );
  const [creationModalOpen, setCreationModalOpen] = useState<boolean>(false);

  const {
    isOpen: isOpenArchive,
    toggle: toggleArchive,
    foldable: foldableArchive,
  } = useFoldable(false);

  const dispatch = useDispatch();

  useSetOnceCoreSelectionList("product");

  const products = useSelector<RootState, ProductList>(
    (state) => state.core.product.productList
  );
  const activeProductNumber = Object.values(products).filter(product => !product.archivedDate).length;

  // used for check
  const productsSelected = useSelector<RootState, Record<number, boolean>>(
    state => state.coreSelection.product
  );

  const renderProducts = (active: boolean) => {
    return Object.values(products).filter(product => active === !product.archivedDate).map((product) => {
      return (
        <div>
          {/* <SiteProductCheckbox
            sectionName={"products"}
            id={product.id}
            onSelect={() => dispatch(setProductSelection({productId: product.id, check: !productsSelected[product.id]}))}
            isSelected={productsSelected[product.id]}
          /> */}
          <EditBox
            key={product.id}
            title={product.name}
            description={product.description}
            isArchived={!!product.archivedDate}
            quantity={product.quantity ?? undefined}
            onArchiveClick={withReadOnlyAccessControl(() => {
              dispatch(requestArchive(product.id));
            })}
            onUnarchiveClick={withReadOnlyAccessControl(() => {
              dispatch(requestUnarchive(product.id));
            })}
            onEditClick={withReadOnlyAccessControl(() => {
              setEditingProductId(product.id);
            })}
          />
        </div>
      );
    });
  };

  const renderArchivedList = () => {
    return (
      <div className={cx(styles.archivedListContainer)}>
        {renderProducts(false)}
      </div>
    );
  }

  return (
    <SiteProductLayout>
      <div className={cx(styles.container)}>
        <div className={cx(styles.main)}>
          {
            activeProductNumber ? renderProducts(true) : (
              <p className={cx(styles.noItemText)}>{upperFirst(t("product.noConfiguredProduct"))}.</p>
            )
          }
          <div className={cx(styles.seeArchivesLinkContainer)}>
            <a className={cx(styles.seeArchivesLink)} onClick={toggleArchive}><i className={cx(isOpenArchive ? "fa fa-eye-slash" : "fa fa-archive")}></i> {isOpenArchive ? upperFirst(t("product.archive.hide")) : upperFirst(t("product.archive.see"))}</a>
          </div>
          {foldableArchive(renderArchivedList())}
          <ButtonSpinner
            spinnerOn={false}
            onClick={withReadOnlyAccessControl(() => setCreationModalOpen(true))}
            className={cx("button-2")}
          >
            + {upperFirst(t("global.add"))}
          </ButtonSpinner>
        </div>
      </div>
      <EditProductModal
        editingProduct={!editingProductId ? undefined : products[editingProductId]}
        onClose={() => setEditingProductId(undefined)}
      />
      <CreateProductModal
        open={creationModalOpen}
        onClose={() => setCreationModalOpen(false)}
      />
    </SiteProductLayout>
  );
};

export default Product;
