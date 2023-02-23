import React, { useState, useEffect, useMemo } from "react";
import cx from "classnames";
import useFoldable from "@hooks/utils/useFoldable";
import styles from "@styles/campaign/detail/activity/sub/activity-entries/editEntry.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { ActivityEntryReferenceHistory, EntryData } from "@reducers/entries/campaignEntriesReducer";
import { cleanHistoryList, getHistoryList } from "@selectors/activityEntries/selectReferenceHistory";
import { convertToTons } from "@lib/utils/calculator";
import { readableUncertainty } from "@custom-types/core/Uncertainty";
import { Campaign } from "@reducers/campaignReducer";
import { CampaignStatus } from "@custom-types/core/CampaignStatus";
import { CampaignType } from "@custom-types/core/CampaignType";
import { renderComputeMethodCell, renderEFCell, renderOwnerCell, renderTooltipContent, renderValue1Cell, renderValue2Cell, renderWriterCell, renderTagCell } from "./helpers/historyCellsFormatter";
import useAllEntryTagList from "@hooks/core/useAllEntryTagList";
import { upperFirst } from "lodash";
import { t } from "i18next";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

interface HistoryColumn {
  year: number;
  activityEntry: ActivityEntryReferenceHistory | undefined;
  isCurrent: boolean;
}

interface Props {
  editEntryIsVisible: boolean;
  campaignId: number;
  activityModelId: number;
  entryKey: string;
  currentEntry: EntryData;
}

const EntryReferenceHistory = ({
  editEntryIsVisible,
  campaignId,
  activityModelId,
  entryKey,
  currentEntry,
}: Props) => {
  const currentYear = useSelector<RootState, number>(
    state => state.campaign.campaigns[campaignId]!.information!.year
  );

  const computeMethods = useSelector((state: RootState) => state.core.emissionFactor.mapping[activityModelId]);

  const historyList = useSelector<RootState, ActivityEntryReferenceHistory[]>(state => getHistoryList(state, {campaignId, entryKey}));
  const cleanedHistoryList = useMemo(() => {
    return cleanHistoryList({list: historyList, entry: currentEntry})
      .slice(0, 10);
  }, [historyList]);

  const campaigns = useSelector<RootState, {[key: number]: Campaign}>(
    state => state.campaign.campaigns
  );
  const historyAvailableCampaigns = Object.values(campaigns).filter(campaign => {
    if (!campaign.information?.status || campaign.information?.status === CampaignStatus.ARCHIVED) {
      return false;
    }
    if (!campaign.information?.type || campaign.information?.type === CampaignType.DRAFT) {
      return false;
    }
    return true;
  }).reduce((acc, campaign) => {
    const campaignYear = campaign.information?.year;
    if (campaignYear != null) {
      if (
        acc[campaignYear] == null ||
        campaign.information?.type === CampaignType.CARBON_FOOTPRINT
      ) {
        acc[campaignYear] = campaign;
      }
    }
    return acc;
  }, {} as Record<number, Campaign>)
  const historyListToDisplay: HistoryColumn[] = Object.values(historyAvailableCampaigns).map(campaign => {
    const matchingActivityEntryHistory = cleanedHistoryList.find(ae => ae.campaignYear === campaign.information!.year);
    return {
      year: campaign.information!.year,
      activityEntry: matchingActivityEntryHistory,
      isCurrent: campaign.information!.year === currentYear,
    }
  }).sort((r1, r2) => r1.year <= r2.year ? -1 : 1);

  const allTags = useAllEntryTagList();

  const {
    isOpen,
    close,
    toggle,
    foldable,
  } = useFoldable();

  useEffect(() => {
    if (!editEntryIsVisible) {
      close();
    }
  }, [editEntryIsVisible]);

  const renderHistoryHeader = () => {
    return historyListToDisplay.map(historyColumn => (
      <td className={cx(styles.historyCell)} key={`head-${historyColumn.year}`}>
        <div className={cx(styles.historyCellDiv)}>
          {historyColumn.year}
        </div>
      </td>
    ))
  };

  const renderHistoryAttr = (callbackForHistoryColumn: (hc: HistoryColumn) => any, callbackForCurrent: () => any) => {
    return historyListToDisplay.map(historyColumn => {
      if (historyColumn.isCurrent) {
        return (
          <td className={cx(styles.historyCell)} key={'current'}>
            <div className={cx(styles.historyCellDiv)}>
              {callbackForCurrent()}
            </div>
          </td>
        )
      }

      const ae = historyColumn.activityEntry;

      if (!ae) {
        return (
          <td className={cx(styles.historyCell)} key={`empty-${historyColumn.year}`}>
            <div className={cx(styles.historyCellDiv)}>
              {'-'}
            </div>
          </td>
        )
      }

      return (
        <td className={cx(styles.historyCell)} key={ae.id}>
          <div className={cx(styles.historyCellDiv)}>
            {callbackForHistoryColumn(historyColumn)}
          </div>
        </td>
      )
    })
  }

  const renderHistory = () => {

    if (!editEntryIsVisible) {
      return <></>;
    }
    
    if (!historyListToDisplay.length) {
      return (
        <div className={cx(styles.noHistoryWrapper)}>
          <p className={cx(styles.noHistoryText)}>{upperFirst(t("entry.history.noHistory"))}</p>
        </div>
      )
    }

    return (
      <div className={cx(styles.historyTableContainer)}>
        <div className={cx(styles.tableWrapper)}>
          <table className={cx("wecount-table", styles.historyTable)}>
            <thead>
              <tr>
                <th className={cx(styles.historyLegendCell)}>{upperFirst(t("entry.value.value"))}</th>
                {renderHistoryHeader()}
              </tr>
            </thead>
            <tbody>
              <tr>
                  <td className={cx(styles.historyLegendCell)}>{upperFirst(t("entry.computeMethod.computeMethod"))}</td>
                  {renderHistoryAttr(hc => {
                    const ae = hc.activityEntry!;
                    return renderComputeMethodCell(computeMethods, ae.computeMethodType, ae.computeMethod?.id ?? null)
                  }, () => {
                    return renderComputeMethodCell(computeMethods, currentEntry.computeMethodType, currentEntry.computeMethodId)
                  })}
              </tr>
              <tr>
                  <td className={cx(styles.historyLegendCell)}>{upperFirst(t("entry.emission.emissionFactor"))}</td>
                  {renderHistoryAttr(
                    hc => {
                      const ae = hc.activityEntry!;
                      return renderEFCell(hc.activityEntry!.emissionFactor, ae.computeMethodType, ae);
                    },
                    () => {
                      return renderEFCell(currentEntry!.emissionFactor, currentEntry.computeMethodType, currentEntry);
                    }
                  )}
              </tr>
              <tr>
              <td className={cx(styles.historyLegendCell)}>{upperFirst(t("entry.value.value1"))}</td>
                  {renderHistoryAttr(
                    hc => renderValue1Cell(computeMethods, hc.activityEntry!.computeMethod?.id ?? null, hc.activityEntry!, hc.activityEntry!.computeMethodType),
                    () => renderValue1Cell(computeMethods, currentEntry.computeMethodId, currentEntry, currentEntry.computeMethodType)
                  )}
              </tr>
              <tr>
                  <td className={cx(styles.historyLegendCell)}>{upperFirst(t("entry.value.value2"))}</td>
                  {renderHistoryAttr(
                    hc => renderValue2Cell(computeMethods, hc.activityEntry!.computeMethod?.id ?? null, hc.activityEntry!),
                    () => renderValue2Cell(computeMethods, currentEntry.computeMethodId, currentEntry)
                  )}
              </tr>
              <tr>
                  <td className={cx(styles.historyLegendCell)}>{upperFirst(t("entry.uncertainty"))}</td>
                  {renderHistoryAttr(
                    hc => readableUncertainty(hc.activityEntry!.uncertainty),
                    () => readableUncertainty(currentEntry.uncertainty)
                  )}
              </tr>
              <tr>
                  <td className={cx(styles.historyLegendCell)}>{upperFirst(t("footprint.emission.emission.plural"))}</td>
                  {renderHistoryAttr(
                    hc => `${reformatConvertToTons(hc.activityEntry!.resultTco2)} ${t("footprint.emission.tco2.tco2e")}`,
                    () => `${reformatConvertToTons(currentEntry.resultTco2)} ${t("footprint.emission.tco2.tco2e")}`,
                  )}
              </tr>
              <tr>
                  <td className={cx(styles.historyLegendCell)}>Source</td>
                  {renderHistoryAttr(
                    hc => renderTooltipContent(`${hc.activityEntry!.dataSource ?? '-'}`),
                    () => renderTooltipContent(`${currentEntry!.dataSource ?? '-'}`),
                  )}
              </tr>
              <tr>
                  <td className={cx(styles.historyLegendCell)}>{upperFirst(t("entry.comment.comment.singular"))}</td>
                  {renderHistoryAttr(
                    hc => renderTooltipContent(`${hc.activityEntry!.description ?? '-'}`),
                    () => renderTooltipContent(`${currentEntry.description ?? '-'}`)
                  )}
              </tr>
              <tr>
                  <td className={cx(styles.historyLegendCell)}>Writer</td>
                  {renderHistoryAttr(
                    hc => renderWriterCell(hc.activityEntry!),
                    () => renderWriterCell(currentEntry),
                  )}
              </tr>
              <tr>
                  <td className={cx(styles.historyLegendCell)}>Owner</td>
                  {}
                  {renderHistoryAttr(
                    hc => renderOwnerCell(hc.activityEntry!),
                    () => renderOwnerCell(currentEntry),
                  )}
              </tr>
              <tr>
                <td className={cx(styles.historyLegendCell)}>Tags</td>
                {
                  renderHistoryAttr(
                    hc =>
                    hc.activityEntry?.entryTagIds.map(tagId =>
                      renderTagCell(allTags[tagId]?.name, tagId)
                    ),
                  () =>
                    currentEntry.entryTagIds.map(tagId =>
                      renderTagCell(allTags[tagId]?.name, tagId)
                    )
                  )
                }
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  } 

  return (
    <div className={cx(styles.historyContainer)}>
      <a onClick={(e) => {
        e.preventDefault();
        toggle();
      }} className={cx(styles.seeHistoryLink)}>
        {isOpen ? upperFirst(t("entry.history.hideHistory")) : upperFirst(t("entry.history.showHistory"))}
      </a>
        
      {foldable(renderHistory())}
    </div>
  );
};

export default EntryReferenceHistory;
