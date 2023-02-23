import { useSelector } from "react-redux";
import cx from "classnames";

import { RootState } from "@reducers/index";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import { convertToTons } from "lib/utils/calculator";

import useAllProductList from "@hooks/core/useAllProductList";
import { selectProductInfoTotal } from "@selectors/activityEntryInfo/selectEntityInfoTotal";

import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

interface Props {
  campaignId: number;
  entries: ActivityEntryExtended[];
}

const ProductsKpiTable = ({ campaignId, entries }: Props) => {
  const allProducts = useAllProductList();

  const productInfoTotal = useSelector((state: RootState) =>
    selectProductInfoTotal(state, entries)
  );

  const productIds = Object.keys(productInfoTotal).map(Number);

  return (
    <div className={styles.productKpiTableWrapper}>
      <table className={cx("wecount-table", styles.productsKpiTable)}>
        <thead>
          <tr>
            <th className="text-left">{upperFirst(t("product.product"))}</th>
            <th>{t("footprint.emission.tco2.tco2Total")}</th>
            <th>{t("footprint.nbrUnit")}</th>
            <th>{t("footprint.emission.tco2.tco2PerUnit")}</th>
          </tr>
        </thead>
        <tbody>
          {productIds.map(productId => {
            const product = allProducts[productId];
            const productTco2 = productInfoTotal[productId].tCo2;

            const productQuantity = product?.quantity ?? 0;
            const resultByProductQuantity =
              productQuantity !== 0 ? productTco2 / productQuantity : 0;

            const isNotAffectedProduct = productId === -1;
            return (
              <tr key={`${campaignId}-${product?.id}`}>
                <td className="text-left">{product?.name}</td>
                <td>
                  <b>{reformatConvertToTons(productTco2)}</b>
                </td>
                <td className={cx({ ["text-muted"]: isNotAffectedProduct })}>
                  <b>{isNotAffectedProduct ? <i>na</i> : productQuantity}</b>
                </td>
                <td className={cx({ ["text-muted"]: isNotAffectedProduct })}>
                  <b>
                    {isNotAffectedProduct ? (
                      <i>na</i>
                    ) : (
                      reformatConvertToTons(resultByProductQuantity)
                    )}
                  </b>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ProductsKpiTable;
