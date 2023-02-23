import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import ReglementationTable from "./ReglementationTable";

interface Props {
  entries: ActivityEntryExtended[];
}

const GHG = ({ entries }: Props) => {
  return (
    <ReglementationTable
      entries={entries}
      columns={[
        "co2",
        "ch4",
        "n2O",
        "hfc",
        "pfc",
        "sf6",
        "otherGaz",
        "result",
        "co2b",
        "uncertainty",
      ]}
      type="GHG"
      indexLinesByCategory
    />
  );
};

export default GHG;
