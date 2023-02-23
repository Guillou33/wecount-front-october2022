import { useState } from "react";
import cx from "classnames";
import { IndicatorsById } from "@reducers/indicator/indicatorReducer";
import IndicatorRow from "@components/dashboard/campaign/sub/IndicatorTable/IndicatorRow";
import CreateIndicatorModale from "@components/dashboard/campaign/sub/IndicatorTable/CreateIndicatorModale";
import EditIndicatorModale from "@components/dashboard/campaign/sub/IndicatorTable/EditIndicatorModale";

import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import styles from "@styles/dashboard/campaign/sub/indicatorTable.module.scss";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  campaignId: number;
  indicators: IndicatorsById;
  entries: ActivityEntryExtended[];
}

const IndicatorTable = ({
  campaignId,
  indicators,
  entries,
}: Props) => {
  const [modaleStates, setModaleStates] =
    useState<"closed" | "creation" | "edition">("closed");

  const [editIndicatorId, setEditIndicatorId] = useState<number | null>(null);

  const editIndicatorData =
    editIndicatorId !== null
      ? {
          id: editIndicatorId,
          name: indicators[editIndicatorId].name,
          unit: indicators[editIndicatorId].unit,
          quantity: indicators[editIndicatorId].quantity,
        }
      : null;
  return (
    <div className={styles.indicatorTableWrapper}>
      <table className={cx("wecount-table", styles.indicatorTable)}>
        <thead>
          <tr>
            <th>{upperFirst(t("indicator.indicator"))}</th>
            <th>{upperFirst(t("indicator.unityVolume"))}</th>
            <th>{upperFirst(t("footprint.scope.upstream"))}</th>
            <th>{upperFirst(t("footprint.scope.core"))}</th>
            <th>{upperFirst(t("footprint.scope.downstream"))}</th>
            <th>{upperFirst(t("global.common.total"))}</th>
            <th>{upperFirst(t("global.common.actions"))}</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(indicators).map(indicator => {
            return (
              <IndicatorRow
                key={indicator.id}
                onClick={setEditIndicatorId}
                entries={entries}
                {...indicator}
              />
            );
          })}
          <tr>
            <td colSpan={8}>
              <button
                className="button-1"
                onClick={() => setModaleStates("creation")}
              >
                {upperFirst(t("indicator.addIndicator"))}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
      <CreateIndicatorModale
        campaignId={campaignId}
        open={modaleStates === "creation"}
        onClose={() => setModaleStates("closed")}
      />
      <EditIndicatorModale
        campaignId={campaignId}
        indicatorData={editIndicatorData}
        onClose={() => setEditIndicatorId(null)}
      />
    </div>
  );
};

export default IndicatorTable;
