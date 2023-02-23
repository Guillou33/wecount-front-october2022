import { memoize } from "lodash";

import mapObject from "@lib/utils/mapObject";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import {
  getEntryInfoByActivityModel,
  EntryInfoByActivityModel,
} from "./getEntryInfoByActivityModel";

export type CampaignsEntryInfoByActivityModel = Record<
  number,
  EntryInfoByActivityModel
>;

export type EntriesByCampaign = Record<number, ActivityEntryExtended[]>;

function getCampaignsEntryInfoByActivityModel(
  entriesByCampaign: EntriesByCampaign
): CampaignsEntryInfoByActivityModel {
  return mapObject(entriesByCampaign, getEntryInfoByActivityModel);
}

const memoizedCampaignsEntryInfoByActivityModel = memoize(
  getCampaignsEntryInfoByActivityModel
);

export default memoizedCampaignsEntryInfoByActivityModel;
