import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import cx from "classnames";
import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import styles from "@styles/dashboard/campaign/campaignDashboard.module.scss";

import selectFilteredActivityEntriesForAnalysis from "@selectors/activityEntries/selectFilteredActivityEntriesForAnalysis";

import useSetOnceReglementationTables from "@hooks/core/reduxSetOnce/useSetOnceReglementationTables";
import useSetOnceReglementationTableCampaignData from "@hooks/core/reduxSetOnce/useSetOnceReglementationTableCampaignData";
import { resetAllCampaignData } from "@actions/reglementationTables/reglementationTablesActions";

import BEGES from "@components/dashboard/campaign/sub/ReglementationTable/BEGES";
import GHG from "@components/dashboard/campaign/sub/ReglementationTable/GHG";
import ISO from "@components/dashboard/campaign/sub/ReglementationTable/ISO";
import Tabs from "@components/helpers/ui/Tabs";
import {
  DownloadBEGES,
  DownloadGHG,
  DownloadISO,
} from "@components/dashboard/campaign/sub/ReglementationTable/DownloadTables";

interface Props {
  campaignId: number;
}

const ReglementationDashboards = ({ campaignId }: Props) => {
  const dispatch = useDispatch();
  useSetOnceReglementationTables();

  const filteredEntries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForAnalysis(state, campaignId)
  );

  const [currentTable, setCurrentTable] = useState<"BEGES" | "GHG" | "ISO">(
    "BEGES"
  );
  useSetOnceReglementationTableCampaignData(campaignId, currentTable);

  useEffect(() => {
    return () => {
      dispatch(resetAllCampaignData());
    };
  }, []);

  return (
    <>
      <div className={styles.reglementationTableTopBar}>
        <Tabs
          value={currentTable}
          onChange={setCurrentTable}
          tabItems={[
            {
              label: "BEGES",
              value: "BEGES",
            },
            {
              label: "GHG",
              value: "GHG",
            },
            {
              label: "ISO",
              value: "ISO",
            },
          ]}
        />
        {currentTable === "BEGES" && (
          <DownloadBEGES entries={filteredEntries} />
        )}
        {currentTable === "GHG" && <DownloadGHG entries={filteredEntries} />}
        {currentTable === "ISO" && <DownloadISO entries={filteredEntries} />}
      </div>

      <div className={cx(styles.overviewTableContainer, "mt-3")}>
        {currentTable === "BEGES" && <BEGES entries={filteredEntries} />}
        {currentTable === "GHG" && <GHG entries={filteredEntries} />}
        {currentTable === "ISO" && <ISO entries={filteredEntries} />}
      </div>
    </>
  );
};

export default ReglementationDashboards;
