import { ActivityInfo } from "@hooks/core/helpers/activityInfo";
import { Activity } from "@reducers/campaignReducer";
import _ from "lodash";

export function getSitesProductsResultsFromActivityInfo(
    activity: ActivityInfo,
    selectedSites: Array<number>,
    selectedProducts: number[]
): number {
    const mustFilterSites = selectedSites.length !== 0;
    const mustFilterProducts = selectedProducts.length !== 0;

    if (mustFilterSites && mustFilterProducts) {
        const sitesAndProductsCouples = selectedSites.flatMap(siteId =>
            selectedProducts.map(productId => `${siteId},${productId}`)
        );
        return sitesAndProductsCouples.reduce(
            (result, siteProductId) =>
                result + (activity?.tco2BySitesAndProducts?.[siteProductId] ?? 0),
            0
        );
    }
    if (mustFilterSites && !mustFilterProducts) {
        return selectedSites.reduce(
            (result, siteId) => result + (activity?.tco2BySites?.[siteId] ?? 0),
            0
        );
    }
    if (mustFilterProducts && !mustFilterSites) {
        return selectedProducts.reduce(
            (result, siteId) => result + (activity?.tco2ByProducts?.[siteId] ?? 0),
            0
        );
    }

    return activity.tCo2;
}

export function getSitesProductsResultsFromActivity(
    activity: Activity,
    selectedSites: number[],
    selectedProducts: number[]
): number {
    const mustFilterSites = selectedSites.length !== 0;
    const mustFilterProducts = selectedProducts.length !== 0;
    const entries = activity?.activityEntries ?? [];

    if (mustFilterSites && mustFilterProducts) {
        return entries
            .filter(entry => selectedSites.includes(entry?.siteId ?? -1))
            .filter(entry => selectedProducts.includes(entry?.productId ?? -1))
            .map(entry => entry.resultTco2)
            .reduce((sum, tco2) => sum + tco2, 0);
    }
    if (mustFilterSites && !mustFilterProducts) {
        return entries
            .filter(entry => selectedSites.includes(entry?.siteId ?? -1))
            .map(entry => entry.resultTco2)
            .reduce((sum, tco2) => sum + tco2, 0);
    }
    if (mustFilterProducts && !mustFilterSites) {
        return entries
            .filter(entry => {
                return selectedProducts.includes(entry?.productId ?? -1);
            })
            .map(entry => entry.resultTco2)
            .reduce((sum, tco2) => sum + tco2, 0);
    }
    return activity.resultTco2 ?? 0;
}

export function getSiteResult(
    activityInfo: ActivityInfo,
    siteId: number,
    selectedProducts: number[]
): number {
    if (selectedProducts.length === 0) {
        return activityInfo.tco2BySites[siteId] ?? 0;
    }
    return selectedProducts.reduce((result, productId) => {
        const productTco2 =
            activityInfo.tco2BySitesAndProducts[`${siteId},${productId}`];
        return result + (productTco2 ?? 0);
    }, 0);
}

export function getProductResult(
    activityInfo: ActivityInfo,
    productId: number,
    selectedSites: number[]
): number {
    if (selectedSites.length === 0) {
        return activityInfo.tco2ByProducts[productId] ?? 0;
    }
    return selectedSites.reduce((result, siteId) => {
        const siteTco2 =
            activityInfo.tco2BySitesAndProducts[`${siteId},${productId}`];
        return result + (siteTco2 ?? 0);
    }, 0);
}
