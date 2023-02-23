import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import ReglementationTable from "./ReglementationTable";

interface Props {
  entries: ActivityEntryExtended[];
}

const ISO = ({ entries }: Props) => {
  return (
    <ReglementationTable
      entries={entries}
      type="ISO"
      enumrateCategories
      indexLinesByCategory
      columns={[
        "co2",
        "ch4",
        "n2O",
        "fluoredGaz",
        "otherGaz",
        "result",
        "co2bCombustion",
        "co2bOther",
        "uncertainty",
      ]}
    />
  );
};

export default ISO;
