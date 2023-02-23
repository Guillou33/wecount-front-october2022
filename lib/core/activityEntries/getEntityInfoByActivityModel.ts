import { memoize } from "lodash";

import getEntryInfoByActivityModel from "./getEntryInfoByActivityModel";

import {
  getEntryInfoByEntity,
  ActivityEntriesByEntity,
} from "./getEntryInfoByEntity";
import { EntryInfoByActivityModel } from "./getEntryInfoByActivityModel";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import mapObject from "@lib/utils/mapObject";

export type EntryInfoBySitesAndActivityModel = Record<
  number,
  EntryInfoByActivityModel
>;

export type EntityInfoByActivityModelGetter = ReturnType<
  typeof getEntityInfoByActivityModel
>;

function getEntityInfoByActivityModel(
  entryInfoGetter: (entries: ActivityEntryExtended[]) => ActivityEntriesByEntity
) {
  return (entries: ActivityEntryExtended[]) => {
    const entriesByEntity = entryInfoGetter(entries);

    return mapObject(entriesByEntity, entityEntries =>
      getEntryInfoByActivityModel(entityEntries)
    );
  };
}

export const getSiteInfoByActivityModel = memoize(
  getEntityInfoByActivityModel(getEntryInfoByEntity("siteId"))
);

export const getProductInfoByActivityModel = memoize(
  getEntityInfoByActivityModel(getEntryInfoByEntity("productId"))
);

export const getOwnerInfoByActivityModel = memoize(
  getEntityInfoByActivityModel(getEntryInfoByEntity("ownerId"))
);

export const getWriterInfoByActivityModel = memoize(
  getEntityInfoByActivityModel(getEntryInfoByEntity("writerId"))
);