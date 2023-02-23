import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesForTrajectory";
import { EntriesHistory } from "@lib/core/campaignHistory/getHistoryFromEntries";

type EntryGroup = {
  entry1: ActivityEntryExtended | null;
  entry2: ActivityEntryExtended | null;
};

type EvolutionGroup = {
  entry1: ActivityEntryExtended;
  entry2: ActivityEntryExtended;
};

type NewGroup = {
  entry1: ActivityEntryExtended | null;
  entry2: ActivityEntryExtended;
};

type OldGroup = {
  entry1: ActivityEntryExtended;
  entry2: ActivityEntryExtended | null;
};

type EntriesChecker = (entries: EntryGroup) => boolean;

type HistoryChecker = {
  campaignOneId: number;
  campaignTwoId: number;
  entriesChecker: EntriesChecker;
};

function historyChecker({
  campaignOneId,
  campaignTwoId,
  entriesChecker,
}: HistoryChecker) {
  return (entriesHistory: EntriesHistory) => {
    return entriesChecker(
      getEntryGroup(entriesHistory, campaignOneId, campaignTwoId)
    );
  };
}

function getEntryGroup(
  entriesHistory: EntriesHistory,
  campaignOneId: number,
  campaignTwoId: number
) {
  const entry1 = entriesHistory.entriesBycampaignId[campaignOneId] ?? null;
  const entry2 = entriesHistory.entriesBycampaignId[campaignTwoId] ?? null;

  return { entry1, entry2 };
}

const isEvolutionGroup = (entries: EntryGroup): entries is EvolutionGroup =>
  entries.entry1 != null &&
  entries.entry1.resultTco2 !== 0 &&
  entries.entry2 != null &&
  entries.entry2.resultTco2 !== 0;

const isNewGroup = (entries: EntryGroup): entries is NewGroup =>
  !isEvolutionGroup(entries) &&
  entries.entry2 != null &&
  entries.entry2.resultTco2 !== 0;

const isOldGroup = (entries: EntryGroup): entries is OldGroup =>
  !isEvolutionGroup(entries) &&
  entries.entry1 != null &&
  entries.entry1.resultTco2 !== 0;

export {
  getEntryGroup,
  historyChecker,
  isEvolutionGroup,
  isNewGroup,
  isOldGroup,
};
