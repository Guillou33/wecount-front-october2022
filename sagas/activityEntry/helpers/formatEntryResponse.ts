import { ActivityEntryFullResponse } from "@lib/wecount-api/responses/apiResponses";
import { EntryData } from "@reducers/entries/campaignEntriesReducer";

export function formatEntryResponse(
  entryResponse: ActivityEntryFullResponse
): EntryData {
  const {
    site,
    product,
    computeMethod,
    activity,
    owner,
    writer,
    entryTagMappings,
    activityEntryReference,
    ...restEntry
  } = entryResponse;
  
  return {
    ...restEntry,
    productId: product?.id ?? null,
    siteId: site?.id ?? null,
    activityModelId: activity.activityModel.id,
    emissionFactorId: entryResponse?.emissionFactor?.id ?? null,
    customEmissionFactorId: entryResponse?.customEmissionFactor?.id ?? null,
    computeMethodId: entryResponse?.computeMethod?.id ?? null,
    ownerId: owner?.id ?? null,
    writerId: writer?.id ?? null,
    activityEntryReference,
    activityEntryReferenceHistoryList: [],
    entryTagIds: entryTagMappings.map(
      entryTagMapping => entryTagMapping.entryTagId
    ),
  };
}
