import React, { useEffect } from "react";
import styles from "@styles/perimeter/perimeterHome.module.scss";
import cx from 'classnames';
import { RootState } from "@reducers/index";
import { useDispatch, useSelector } from "react-redux";

import { clearFilters, setExcludedData} from "@actions/perimeter/perimeterActions";
import { CampaignEmission } from "@reducers/perimeter/perimeterReducer";

import selectAllCampaignsWithEmissions from "@selectors/perimeters/selectAllCampaignsWithEmissions";
import selectCampaignsInStatusesAndYears from "@selectors/perimeters/selectCampaignsInStatusesAndYears";
import selectYearsInCampaigns from "@selectors/perimeters/selectYearsInCampaigns";

import { CampaignStatus } from "@custom-types/core/CampaignStatus";

import { DefaultContainer } from "@components/helpers/ui/selects/selectionContainers";
import { MultiSelect, SelectOne, Option } from "@components/helpers/ui/selects";
import CampaignStatusBadge from "@components/core/CampaignStatusBadge";
import DecadeChooser from "@components/helpers/ui/selects/utils/DecadeChooser";
import { getDecade } from "@components/helpers/ui/selects/YearPicker";
import { t } from "i18next";
import { range, upperFirst } from "lodash";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";
import { excludedOptions } from "@custom-types/core/ExcludedOptions";

const allStatuses: CampaignStatus[] = [
    CampaignStatus.ARCHIVED,
    CampaignStatus.CLOSED,
    CampaignStatus.IN_PREPARATION,
    CampaignStatus.IN_PROGRESS 
];

interface Props {
    onSelectCampaigns: (selection: number[]) => void;
    onSelectCampaignStatus: (selection: CampaignStatus[]) => void;
    onSelectCampaignsYears: (selection: number[]) => void;
}

const MultiSelectsForSynthesis = ({
    onSelectCampaigns,
    onSelectCampaignStatus,
    onSelectCampaignsYears
}: Props) => {
    const dispatch = useDispatch();

    const [spinnerExcluded, setSpinnerExcluded] = React.useState(false);

    const [decadeOffset, setDecadeOffset] = React.useState(0);
    const decrementDecadeOffset = () => setDecadeOffset(decade => decade - 1);
    const incrementDecadeOffset = () => setDecadeOffset(decade => decade + 1);

    const initialDecade = getDecade(new Date().getFullYear());
    const years = range((initialDecade + decadeOffset) * 10 + 9, (initialDecade + decadeOffset) * 10 - 1);

    const yearsInCampaigns = useSelector<RootState, number[]>(
        state => selectYearsInCampaigns(state)
    );

    const selectedExcludedData = useSelector<RootState, number>(
      state => state.perimeter.synthesis.display.excluded
    );
    const excludedOptionsForSynthesis = excludedOptions.filter(option => option.value !== 0);

    const campaignsName = useSelector<RootState, CampaignEmission[]>(
        state => selectCampaignsInStatusesAndYears(state)
    );

    const campaignsNameInMultiSelect = useSelector<RootState, CampaignEmission[]>(
      state => selectAllCampaignsWithEmissions(state)
  );

    const selectedCampaigns = useSelector<RootState, number[]>(
        state => state.perimeter.synthesis.filter.selection
    );

    const selectedStatus = useSelector<RootState, CampaignStatus[]>(
        state => state.perimeter.synthesis.filter.status
    );

    const selectedYears = useSelector<RootState, number[]>(
        state => state.perimeter.synthesis.filter.years
    );

    return (
        <div className={cx(styles.campaignSelectionForm)}>
          <div className={cx(styles.campaignSelectionFields)}>
            {/**
             * Years Selection
             */}
            <div className={cx(styles.multiSelectField)}>
              <label>{upperFirst(t("global.time.years"))} :</label>
              <MultiSelect
                selected={selectedYears}
                onOptionClick={year => {
                    const updatedYears = selectedYears.includes(year)
                        ? selectedYears.filter(status => status !== year)
                        : [...selectedYears, year];
                    onSelectCampaignsYears(updatedYears);
                }}
                className={cx(styles.selectYear)}
                renderSelectionContainer={ctx => {
                    return (
                      <DefaultContainer {...ctx}>
                        <>
                          {selectedYears.length === 0 && (
                            <span className={styles.placeholder}>{upperFirst(t("perimeter.synthesis.filter.selectYears"))}</span>
                          )}
                          {selectedYears.map((year, index) => (
                            <span className={styles.pill} key={index}>
                              {year}
                                <button
                                  className={styles.removeYearButton}
                                  onClick={e => {
                                    e.stopPropagation();
                                    const newSelection = selectedYears.includes(year)
                                        ? selectedYears.filter(yearItem => yearItem !== year)
                                        : [...selectedYears, year];
                                    onSelectCampaignsYears(newSelection);
                                  }}
                                >
                                  <i className="fa fa-times" />
                                </button>
                            </span>
                          ))}
                        </>
                      </DefaultContainer>
                    );
                  }}
              >
              {ctx => (
                <>
                    {yearsInCampaigns.map((year, index) => (
                        <Option
                            {...ctx}
                            key={index}
                            value={year}
                            className={styles.yearOption}
                        >
                          <CheckboxInput
                            checked={selectedYears.includes(year)}
                            id=""
                            onChange={() => {}}
                          >
                            {year.toString()}
                          </CheckboxInput>
                        </Option>
                    ))}
                </>
                )
              }
              </MultiSelect>
            </div>
            {/**
             * Status Selection
             */}
            <div className={cx(styles.multiSelectField)}>
              <label>{upperFirst(t("status.status.plural"))} :</label>
              <MultiSelect
                selected={selectedStatus}
                onOptionClick={updatedStatus => {
                    const newUpdatedStatutes = selectedStatus.includes(updatedStatus)
                        ? selectedStatus.filter(status => status !== updatedStatus)
                        : [...selectedStatus, updatedStatus];
                    onSelectCampaignStatus(newUpdatedStatutes);
                }}
                className={cx(styles.selectStatus)}
                renderSelectionContainer={ctx => {
                    return (
                      <DefaultContainer {...ctx}>
                        <>
                          {selectedStatus.length === 0 && (
                            <span className={styles.placeholder}>{upperFirst(t("perimeter.synthesis.filter.selectStatuses"))}</span>
                          )}
                          {selectedStatus.map((status,index) => (
                            <span className={cx(styles.pill, styles[status.toLowerCase()])} key={index}>
                              <CampaignStatusBadge status={status} />
                                <button
                                  className={cx(styles.removeStatusButton, styles[status.toLowerCase()])}
                                  onClick={e => {
                                    e.stopPropagation();
                                    const newUpdatedStatutes = selectedStatus.includes(status)
                                        ? selectedStatus.filter(statusItem => statusItem !== status)
                                        : [...selectedStatus, status];
                                    onSelectCampaignStatus(newUpdatedStatutes);
                                  }}
                                >
                                  <i className="fa fa-times" />
                                </button>
                            </span>
                          ))}
                        </>
                      </DefaultContainer>
                    );
                  }}
              >
                {ctx => (
                    <>
                    {
                        allStatuses.map((status, index) => (
                            <Option {...ctx} value={status} key={index} className={styles.statusOption}>
                              <CheckboxInput
                                checked={selectedStatus.includes(status)}
                                id=""
                                onChange={() => {}}
                              >
                                <CampaignStatusBadge status={status} />
                              </CheckboxInput>
                            </Option>
                        ))
                    }
                    </>
                )}
              </MultiSelect>
            </div>
            {/**
             * Campaigns Selection
             */}
            <div className={cx(styles.multiSelectField)}>
              <label>{upperFirst(t("campaign.campaigns"))} :</label>
              <MultiSelect 
                selected={selectedCampaigns}
                onOptionClick={campaignId => {
                    const newSelection = selectedCampaigns.includes(campaignId)
                        ? selectedCampaigns.filter(id => id !== campaignId)
                        : [...selectedCampaigns, campaignId];
                    onSelectCampaigns(newSelection);
                }}
                className={cx(styles.selectCampaigns)}
                renderSelectionContainer={ctx => {
                    return (
                      <DefaultContainer {...ctx}>
                        <>
                          {selectedCampaigns.length === 0 && (
                            <span className={styles.placeholder}>{upperFirst(t("perimeter.synthesis.filter.selectCampaigns"))}</span>
                          )}
                          {/* campaignsNameInMultiSelect ==> set campaigns when selected before years */}
                          {campaignsNameInMultiSelect.filter(campaign => selectedCampaigns.includes(campaign.id)).map(campaign => (
                            <span className={styles.pill} key={campaign.id}>
                              {campaign.name}
                                <button
                                  className={styles.removeCampaignButton}
                                  onClick={e => {
                                    e.stopPropagation();
                                    const newSelection = selectedCampaigns.includes(campaign.id)
                                        ? selectedCampaigns.filter(id => id !== campaign.id)
                                        : [...selectedCampaigns, campaign.id];
                                    onSelectCampaigns(newSelection);
                                  }}
                                >
                                  <i className="fa fa-times" />
                                </button>
                            </span>
                          ))}
                        </>
                      </DefaultContainer>
                    );
                  }}
              >
                {ctx => (
                    <>
                        {campaignsName.map(campaign => (
                            <Option
                                {...ctx}
                                value={campaign.id}
                                key={campaign.id}
                                className={styles.campaignOption}
                            >
                              <CheckboxInput
                                checked={selectedCampaigns.includes(campaign.id)}
                                id=""
                                onChange={() => {}}
                              >
                                {campaign.name}
                              </CheckboxInput>
                            </Option>
                        ))}
                    </>
                )}
              </MultiSelect>
            </div>
            {/**
             * Show excluded/included/all data
             */}
            <div className={cx(styles.selectionExcluded)}>
              <label>
                {upperFirst(t("global.data.data.plural"))} :
              </label>
              <SelectOne
                className={cx([styles.dataSelection])}
                selected={selectedExcludedData}
                onOptionClick={(excluded) => {
                  setSpinnerExcluded(true);
                  dispatch(setExcludedData({
                    excluded,
                  }, excluded => {
                    setSpinnerExcluded(false);
                  }));
                }}
              >
                {(ctx) => (
                  <>
                    {excludedOptionsForSynthesis.map(
                      (option) => (
                        <Option
                          {...ctx}
                          value={option.value}
                          key={option.value}
                        >
                          {option.label}
                        </Option>
                      )
                    )}
                  </>
                )}
              </SelectOne>
              {spinnerExcluded && (
                <div className="spinner-border text-secondary mr-3"></div>
              )}
            </div>
              {(selectedCampaigns.length > 0 || selectedStatus.length > 0 || selectedYears.length > 0) ? (
                <div className={cx(styles.eraseFilters)}>
                  <label></label>
                  <button
                      className={cx("button-1", styles.btnRemoveFilters)}
                      onClick={() => dispatch(clearFilters())}
                    >
                      {upperFirst(t("perimeter.synthesis.filter.eraseFilters"))}
                    </button>
                </div>
              ) : (
                <></>
              )
            }
        </div>
      </div>
    )
}

export default MultiSelectsForSynthesis
