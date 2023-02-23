import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import selectEntryInfoTotal from "@selectors/activityEntryInfo/selectEntryInfoTotal";

import styles from "@styles/campaign/detail/sub/entriesResultRecap.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

interface Props {
  entries: ActivityEntryExtended[];
}
const EntriesResultRecap = ({ entries }: Props) => {
  const { tCo2 } = useSelector((state: RootState) =>
    selectEntryInfoTotal(state, entries)
  );
  return (
    <div className={styles.entriesResultRecap}>
      <p className="mb-0">
        {upperFirst(t("entry.entriesResultRecap.part1"))} <strong>{t("entry.entriesResultRecap.part2", {length: entries.length})}</strong>{" "}
        {t("entry.entriesResultRecap.part3")} : <strong className={styles.result}>{t("entry.entriesResultRecap.part4", {tco2: reformatConvertToTons(tCo2)})}</strong>
      </p>
    </div>
  );
};

export default EntriesResultRecap;
