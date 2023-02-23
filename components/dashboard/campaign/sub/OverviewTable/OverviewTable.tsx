import cx from "classnames";
import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { Scope } from "@custom-types/wecount-api/activity";
import { ActivityCategory } from "@reducers/core/categoryReducer";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import { convertToTons, percentageCalculator } from "@lib/utils/calculator";
import mapObject from "@lib/utils/mapObject";

import useSetOnceProducts from "@hooks/core/reduxSetOnce/useSetOnceProducts";
import useSetOnceSites from "@hooks/core/reduxSetOnce/useSetOnceSites";
import useAllSiteList from "@hooks/core/useAllSiteList";
import useAllProductList from "@hooks/core/useAllProductList";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import useElementDimensions from "@hooks/utils/useElementDimensions";

import {
  selectSiteInfoByActivityModel,
  selectProductInfoByActivityModel,
} from "@selectors/activityEntryInfo/selectEntityInfoByActivityModel";
import {
  selectSiteInfoByCategory,
  selectProductInfoByCategory,
} from "@selectors/activityEntryInfo/selectEntityInfoByCategory";
import {
  selectSiteInfoTotal,
  selectProductInfoTotal,
} from "@selectors/activityEntryInfo/selectEntityInfoTotal";
import selectEntryInfoByCategory from "@selectors/activityEntryInfo/selectEntryInfoByCategory";
import selectEntryInfoByActivityModel from "@selectors/activityEntryInfo/selectEntryInfoByActivityModel";
import selectEntryInfoTotal from "@selectors/activityEntryInfo/selectEntryInfoTotal";
import selectCategoriesInCartographyForCampaign from "@selectors/cartography/selectCategoriesInCartographyForCampaign";

import OverviewTableRow from "./OverviewTableRow";

import styles from "@styles/dashboard/campaign/sub/overviewTable.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";
import useAllSubSitesList from "@hooks/core/useAllSubSiteList";

interface Props {
  sitesOrProducts: "sites" | "products";
  showActionPlan?: boolean;
  entries: ActivityEntryExtended[];
  campaignId: number;
}

const scopeOrder: { [key in Scope]: number } = {
  UPSTREAM: 0,
  CORE: 1,
  DOWNSTREAM: 2,
};

const OverviewTable = ({
  sitesOrProducts,
  showActionPlan = false,
  entries,
  campaignId,
}: Props) => {
  useSetOnceProducts();
  useSetOnceSites();
  const products = useAllProductList();
  const sites = {...useAllSiteList(), ...useAllSubSitesList()};

  const selectEntityInfoByActivityModel =
    sitesOrProducts === "sites"
      ? selectSiteInfoByActivityModel
      : selectProductInfoByActivityModel;
  const entitiesInfoByActivityModel = useSelector((state: RootState) =>
    selectEntityInfoByActivityModel(state, entries)
  );

  const selectEntityInfoByCategory =
    sitesOrProducts === "sites"
      ? selectSiteInfoByCategory
      : selectProductInfoByCategory;
  const entitiesInfoByCategory = useSelector((state: RootState) =>
    selectEntityInfoByCategory(state, entries)
  );

  const selectEntityInfoTotal =
    sitesOrProducts === "sites" ? selectSiteInfoTotal : selectProductInfoTotal;
  const entitiesInfoTotal = useSelector((state: RootState) =>
    selectEntityInfoTotal(state, entries)
  );

  const entryInfoByCategory = useSelector((state: RootState) =>
    selectEntryInfoByCategory(state, entries)
  );
  const entryInfoByActivityModel = useSelector((state: RootState) =>
    selectEntryInfoByActivityModel(state, entries)
  );
  const { tCo2: entryInfoTotal } = useSelector((state: RootState) =>
    selectEntryInfoTotal(state, entries)
  );

  const categoryList = useSelector((state: RootState) =>
    selectCategoriesInCartographyForCampaign(state, campaignId)
  );
  const activityModelInfo = useActivityModelInfo();

  const entities = sitesOrProducts === "sites" ? sites : products;
  const entityIdsToShow = Object.keys(entitiesInfoByActivityModel).map(Number);

  const percentOfTotal = percentageCalculator(entryInfoTotal);

  const [firstColumnRef, { width: firstColumnWidth }] = useElementDimensions();

  return (
    <div className={styles.tableWrapper}>
      <table className={cx("wecount-table", styles.overviewTable)}>
        <thead>
          <tr>
            <th
              className={cx(styles.stickyHeader, styles.onTop, "text-left")}
              ref={firstColumnRef}
            >
              {upperFirst(t("global.common.category"))}
            </th>
            <th
              className={cx(styles.stickyHeader, styles.onTop, "text-left")}
              style={{ left: firstColumnWidth }}
            >
              {upperFirst(t("activity.type"))}
            </th>
            {entityIdsToShow.map(entityId => (
              <th
                key={`${sitesOrProducts}-${entityId}`}
                className={cx(styles.stickyHeader, "text-nowrap")}
              >
                {entities[entityId]?.name}
              </th>
            ))}
            <th className={styles.stickyHeader}>{upperFirst(t("global.common.total"))}</th>
            <th className={styles.stickyHeader}>%</th>
            {showActionPlan && <th>{upperFirst(t("global.common.target"))}</th>}
          </tr>
        </thead>
        {Object.values(categoryList)
          .sort((a, b) => scopeOrder[a.scope] - scopeOrder[b.scope])
          .map((category: ActivityCategory) => (
            <tbody key={category.id}>
              {category.activityModels.map((activityModel, activityIndex) => (
                <OverviewTableRow
                  key={activityModel.id}
                  activityData={{
                    name: activityModelInfo[activityModel.id].name,
                    resultTco2: entryInfoByActivityModel[activityModel.id].tCo2,
                    entityResults: mapObject(
                      entitiesInfoByActivityModel,
                      info => info[activityModel.id].tCo2
                    ),
                  }}
                  categoryData={{
                    id: category.id,
                    name: category.name,
                    scope: category.scope,
                  }}
                  categorySpan={
                    activityIndex === 0 ? category.activityModels.length + 1 : 0
                  }
                  resultTco2Total={entryInfoTotal}
                  entityIdsToShow={entityIdsToShow}
                  firstColumnWidth={firstColumnWidth}
                />
              ))}
              <tr
                className={cx(
                  styles.subTotalRow,
                  styles[category.scope.toLowerCase()],
                  "text-center"
                )}
              >
                <td
                  className={cx(
                    styles.stickyColumn,
                    styles.second,
                    "text-right"
                  )}
                  style={{ left: firstColumnWidth }}
                >
                  {upperFirst(t("global.common.subTotal"))}
                </td>
                {entityIdsToShow.map(entityId => (
                  <td key={`${sitesOrProducts}-${entityId}`}>
                    <b>
                      {reformatConvertToTons(
                        entitiesInfoByCategory[entityId]?.[category.id]?.tCo2 ??
                          0
                      )}
                    </b>{" "}
                    t
                  </td>
                ))}
                <td className="text-nowrap">
                  <b>{reformatConvertToTons(entryInfoByCategory[category.id].tCo2)}</b>{" "}
                  t
                </td>
                <td className="text-nowrap">
                  <b>
                    {formatNumberWithLanguage(percentOfTotal(entryInfoByCategory[category.id].tCo2))} %
                  </b>
                </td>
              </tr>
            </tbody>
          ))}
        <tbody>
          <tr className={cx(styles.totalRow, "text-center")}>
            <td colSpan={2} className={cx(styles.stickyColumn, "text-right")}>
              {upperFirst(t("global.common.total"))}
            </td>
            {entityIdsToShow.map(entityId => (
              <td
                key={`${sitesOrProducts}-${entityId}`}
                className="text-nowrap"
              >
                <b>{reformatConvertToTons(entitiesInfoTotal[entityId]?.tCo2 ?? 0)}</b> t
              </td>
            ))}
            <td className="text-nowrap">
              <b>{reformatConvertToTons(entryInfoTotal)}</b> t
            </td>
            <td className="text-nowrap">
              <b>{formatNumberWithLanguage(percentOfTotal(entryInfoTotal))}</b> %
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default OverviewTable;
