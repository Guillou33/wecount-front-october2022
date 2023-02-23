import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import ReglementationTable from "./ReglementationTable";

interface Props {
  entries: ActivityEntryExtended[];
}

const BEGES = ({ entries }: Props) => {
  return (
    <ReglementationTable
      entries={entries}
      type="BEGES"
      enumrateCategories
      columns={[
        "co2",
        "ch4",
        "n2O",
        "otherGaz",
        "result",
        "co2b",
        "uncertainty",
      ]}
    />
  );
};

export default BEGES;
