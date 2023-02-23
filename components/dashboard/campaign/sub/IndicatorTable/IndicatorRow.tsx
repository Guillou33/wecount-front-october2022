import { useDispatch, useSelector } from "react-redux";
import cx from "classnames";

import { RootState } from "@reducers/index";
import { Scope } from "@custom-types/wecount-api/activity";
import { ActivityEntryExtended } from "@selectors/activityEntries/selectActivityEntriesOfCampaign";

import { convertToTons } from "@lib/utils/calculator";

import { requestDeleteIndicator } from "@actions/indicator/indicatorAction";
import selectEntryInfoTotal from "@selectors/activityEntryInfo/selectEntryInfoTotal";
import selectEntryInfoByScope from "@selectors/activityEntryInfo/selectEntryInfoByScope";

import Tooltip from "@components/helpers/bootstrap/Tooltip";

import styles from "@styles/dashboard/campaign/sub/indicatorTable.module.scss";
import { t } from "i18next";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

interface Props {
  id: number;
  campaignId: number;
  name: string;
  quantity: number | null;
  unit: string | null;
  entries: ActivityEntryExtended[];
  onClick: (indicatorId: number) => void;
}

const IndicatorRow = ({
  id,
  campaignId,
  name,
  quantity,
  unit,
  onClick,
  entries,
}: Props) => {
  const dispatch = useDispatch();

  const entryInfoTotal = useSelector((state: RootState) =>
    selectEntryInfoTotal(state, entries)
  );
  const entryInfoByScope = useSelector((state: RootState) =>
    selectEntryInfoByScope(state, entries)
  );

  const deleteIndicator = (e: React.SyntheticEvent) => {
    e.stopPropagation();
    dispatch(requestDeleteIndicator(campaignId, id));
  };

  const renderUnit = () => (
    <span className={cx({ ["text-muted"]: !unit })}>
      {unit ? unit : t("global.common.unit")}
    </span>
  );

  return (
    <tr key={id} onClick={() => onClick(id)} className={styles.row}>
      <td>{name}</td>
      <td>
        {quantity ?? 0} {renderUnit()}
      </td>

      {quantity ? (
        <>
          {Object.values(Scope).map(scope => {
            return (
              <Tooltip
                content={`${reformatConvertToTons(
                  entryInfoByScope[scope].tCo2
                )} ${t("footprint.emission.tco2.tco2e")} ÷ ${quantity} ${unit}`}
                hideDelay={0}
                key={scope}
              >
                <td>
                  {reformatConvertToTons(entryInfoByScope[scope].tCo2 / quantity)}{" "}
                  {t("footprint.emission.tco2.tco2e")}/
                  {renderUnit()}
                </td>
              </Tooltip>
            );
          })}
          <Tooltip
            content={`${reformatConvertToTons(
              entryInfoTotal.tCo2
            )} ${t("footprint.emission.tco2.tco2e")} ÷ ${quantity} ${unit}`}
            hideDelay={0}
          >
            <td>
              <b>
                {reformatConvertToTons(entryInfoTotal.tCo2 / quantity)} {t("footprint.emission.tco2.tco2e")}/
                {renderUnit()}
              </b>
            </td>
          </Tooltip>
        </>
      ) : (
        <td colSpan={4} className="text-center text-warning">
          <i className="fa fa-exclamation-triangle"></i>
          <span className="ml-1">{t("indicator.defineQuantity")}</span>
        </td>
      )}
      <td style={{display: "flex", justifyContent: "center"}}>
        <i className={cx("fas fa-pen", styles.rowIcon)}></i>
        <button className={cx(styles.deleteButton)} onClick={deleteIndicator}>
          <i className={cx("fa fa-trash")}></i>
        </button>
      </td>
    </tr>
  );
};

export default IndicatorRow;
