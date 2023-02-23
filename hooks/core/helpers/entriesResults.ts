import { ActivityEntry } from "@reducers/campaignReducer";
import { SiteList } from "@reducers/core/siteReducer";
import { ProductList } from "@reducers/core/productReducer";

type Results = {
  [key: number]: number;
};

type SitesAndProductsResults = {
  [siteAndProductIds: string]: number;
};

export function getActivityEntriesResultsBy(
  siteOrProductKey: "siteId" | "productId",
  activityEntries: ActivityEntry[] = [],
  siteProductData: SiteList | ProductList
): Results {
  return activityEntries.reduce((results: Results, entry) => {
    const entityId = getEntityId(siteOrProductKey, entry, siteProductData);
    if (results[entityId] == null) {
      // initialize
      results[entityId] = 0;
    }
    results[entityId] += entry.resultTco2;
    return results;
  }, {});
}

export function getActivityEntriesResultBySitesAndProducts(
  activityEntries: ActivityEntry[] = []
): SitesAndProductsResults {
  return activityEntries.reduce((results: SitesAndProductsResults, entry) => {
    const siteId = entry?.siteId ?? -1;
    const productId = entry?.productId ?? -1;
    const key = `${siteId},${productId}`;
    if (results[key] == null) {
      results[key] = 0;
    }
    results[key] += entry.resultTco2;
    return results;
  }, {});
}

export function sumResults(result1: Results, result2: Results): Results {
  const total = { ...result1 };
  return Object.entries(result2).reduce((total: Results, [key, result]) => {
    if (total[Number(key)] == null) {
      total[Number(key)] = 0;
    }
    total[Number(key)] = total[Number(key)] + result;
    return total;
  }, total);
}

export function sumSitesAndProductsResults(
  result1: SitesAndProductsResults,
  result2: SitesAndProductsResults
): SitesAndProductsResults {
  const total = { ...result1 };
  return Object.entries(result2).reduce((total, [key, result]) => {
    if (total[key] == null) {
      total[key] = 0;
    }
    total[key] += result;
    return total;
  }, total);
}

function getEntityId(
  siteOrProductKey: "siteId" | "productId",
  entry: ActivityEntry,
  siteProductData: SiteList | ProductList
): number {
  //non affected or archived sites/products result are stored under "-1" key
  const entryId = entry[siteOrProductKey];
  if (entryId == null || siteProductData[entryId]?.archivedDate != null) {
    return -1;
  }
  return entryId;
}
