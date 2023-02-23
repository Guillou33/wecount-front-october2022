import DownloadButton from "./DownloadButton";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

interface Props {
  entries: ActivityEntryExtended[];
}

export const DownloadBEGES = ({ entries }: Props) => (
  <DownloadButton
    entries={entries}
    type="BEGES"
    enumrateCategories
    columns={["co2", "ch4", "n2O", "otherGaz", "result", "co2b", "uncertainty"]}
  />
);

export const DownloadGHG = ({ entries }: Props) => (
  <DownloadButton
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

export const DownloadISO = ({ entries }: Props) => (
  <DownloadButton
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
