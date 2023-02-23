import React from "react";
import styles from "@styles/perimeter/perimeterHome.module.scss";
import cx from 'classnames';
import { useDispatch, useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { CategoryList } from "@reducers/core/categoryReducer";
import { setShowCategoriesEmissions, setShowCategoriesPercentages } from "@actions/perimeter/perimeterActions";
import { PerimetersByEmission, ShowActivityModelsInTable } from "@reducers/perimeter/perimeterReducer";

import { Scope } from "@custom-types/wecount-api/activity";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

import RowScope from "./table/RowScope";
import RowReductionScope from "./table/RowReductionScope";
import { getTotalScopes } from "../helpers/totalScopes";
import { getExcludedTco2 } from '../helpers/getScopeProps';

import { t } from "i18next";
import _, { upperFirst } from "lodash";

interface Props {
    perimeters: PerimetersByEmission;
    nonFilteredPerimeters: PerimetersByEmission;
}

const SynthesisTable = ({
    perimeters,
    nonFilteredPerimeters
}: Props) => {
    const dispatch = useDispatch();

    const categoryList = useSelector<RootState, CategoryList>(
        state => state.core.category.categoryList
    );
    
    const showCategoriesEmissions = useSelector<RootState, {
        [Scope.UPSTREAM]: boolean,
        [Scope.CORE]: boolean,
        [Scope.DOWNSTREAM]: boolean
    }>(
        state => state.perimeter.synthesis.table.shownCategories.emissions
    );

    const showActivityModelsEmissions = useSelector<RootState, ShowActivityModelsInTable>(
        state => state.perimeter.synthesis.table.shownActivityModels.emissions
    );

    const showCategoriesPercentages = useSelector<RootState, {
        [Scope.UPSTREAM]: boolean,
        [Scope.CORE]: boolean,
        [Scope.DOWNSTREAM]: boolean
    }>(
        state => state.perimeter.synthesis.table.shownCategories.percentages
    );

    const showActivityModelsPercentages = useSelector<RootState, ShowActivityModelsInTable>(
        state => state.perimeter.synthesis.table.shownActivityModels.percentages
    );

    const selectedExcludedData = useSelector<RootState, number>(
      state => state.perimeter.synthesis.display.excluded
    );

    const totalOfScopes = getTotalScopes(perimeters, selectedExcludedData);

    return (
        <div className={cx(styles.synthesisTableContainer)}>
            <table className={cx(styles.synthesisTable)}>
                <thead>
                    <tr>
                        <th rowSpan={2} className={cx(styles.emptyRows)}></th>
                        {Object.values(perimeters).map(perimeter => {
                            return (
                                <th
                                    key={perimeter.id}
                                    className={cx(styles.perimeterTitleCell)}
                                    style={{ textAlign: "center" }}
                                    colSpan={Object.values(perimeter.campaigns).length + 1}
                                >
                                    {perimeter.name}
                                </th>
                            );
                        })}
                        <th rowSpan={2} className={cx(styles.titleTotalOnPerimeters)}>
                            {upperFirst(t("perimeter.synthesis.totalOnAllPerimeters"))}
                        </th>
                    </tr>
                    <tr>
                        {Object.values(perimeters).map(perimeter => {
                            return (
                                <>
                                    {Object.values(perimeter.campaigns).map(campaign => {
                                        return (
                                            <th
                                                key={campaign.id}
                                                style={{ textAlign: "center" }}
                                                className={cx(styles.campaignTitleCell)}
                                            >
                                                {campaign.name}
                                            </th>
                                        );
                                    })}
                                    <th className={cx(styles.perimeterTotalCell)} key={perimeter.id}>
                                        {upperFirst(t("global.common.total"))}
                                    </th>
                                </>
                            )
                        })}
                    </tr>
                </thead>
                <tbody>
                    {/**
                     * SCOPE UPSTREAM
                     */}
                    <RowScope
                        scope={Scope.UPSTREAM}
                        perimeters={perimeters}
                        nonFilteredPerimeters={nonFilteredPerimeters}
                        categoryList={categoryList}
                        showCategories={showCategoriesEmissions}
                        showActivityModels={showActivityModelsEmissions}
                        setShowCategories={() => {
                            dispatch(setShowCategoriesEmissions(
                                {
                                    ...showCategoriesEmissions,
                                    [Scope.UPSTREAM]: !showCategoriesEmissions[Scope.UPSTREAM]
                                },
                            ));
                        }}
                    />
                    <RowReductionScope
                        scope={Scope.UPSTREAM}
                        perimeters={perimeters}
                        nonFilteredPerimeters={nonFilteredPerimeters}
                        categoryList={categoryList}
                        showCategories={showCategoriesPercentages}
                        showActivityModels={showActivityModelsPercentages}
                        setShowCategories={() => {
                            dispatch(setShowCategoriesPercentages(
                                {
                                    ...showCategoriesPercentages,
                                    [Scope.UPSTREAM]: !showCategoriesPercentages[Scope.UPSTREAM]
                                },
                            ));
                        }}
                    />
                    {/**
                     * SCOPE CORE
                     */}
                    <RowScope
                        scope={Scope.CORE}
                        perimeters={perimeters}
                        nonFilteredPerimeters={nonFilteredPerimeters}
                        categoryList={categoryList}
                        showCategories={showCategoriesEmissions}
                        showActivityModels={showActivityModelsEmissions}
                        setShowCategories={() => {
                            dispatch(setShowCategoriesEmissions(
                                {
                                    ...showCategoriesEmissions,
                                    [Scope.CORE]: !showCategoriesEmissions[Scope.CORE]
                                },
                            ));
                        }}
                    />
                    <RowReductionScope
                        scope={Scope.CORE}
                        perimeters={perimeters}
                        nonFilteredPerimeters={nonFilteredPerimeters}
                        categoryList={categoryList}
                        showCategories={showCategoriesPercentages}
                        showActivityModels={showActivityModelsPercentages}
                        setShowCategories={() => {
                            dispatch(setShowCategoriesPercentages(
                                {
                                    ...showCategoriesPercentages,
                                    [Scope.CORE]: !showCategoriesPercentages[Scope.CORE]
                                },
                            ));
                        }}
                    />
                    {/**
                     * SCOPE DOWNSTREAM
                     */}
                    <RowScope
                        scope={Scope.DOWNSTREAM}
                        perimeters={perimeters}
                        nonFilteredPerimeters={nonFilteredPerimeters}
                        categoryList={categoryList}
                        showCategories={showCategoriesEmissions}
                        showActivityModels={showActivityModelsEmissions}
                        setShowCategories={() => {
                            dispatch(setShowCategoriesEmissions(
                                {
                                    ...showCategoriesEmissions,
                                    [Scope.DOWNSTREAM]: !showCategoriesEmissions[Scope.DOWNSTREAM]
                                },
                            ));
                        }}
                    />
                    <RowReductionScope
                        scope={Scope.DOWNSTREAM}
                        perimeters={perimeters}
                        nonFilteredPerimeters={nonFilteredPerimeters}
                        categoryList={categoryList}
                        showCategories={showCategoriesPercentages}
                        showActivityModels={showActivityModelsPercentages}
                        setShowCategories={() => {
                            dispatch(setShowCategoriesPercentages(
                                {
                                    ...showCategoriesPercentages,
                                    [Scope.DOWNSTREAM]: !showCategoriesPercentages[Scope.DOWNSTREAM]
                                },
                            ));
                        }}
                    />
                    <tr
                        className={cx(styles.rowScope)}
                    >
                        <td className={cx(styles.titleScopeCell, styles.titleTotalCell)}>
                            {upperFirst(t("global.common.total"))} ({t("footprint.emission.tons")})
                        </td>
                        {Object.values(perimeters).map(perimeter => {
                            let totalUpstream = 0;
                            let totalCore = 0;
                            let totalDownstream = 0;
                            return (
                                <>
                                    {Object.values(perimeter.campaigns).map(campaign => {
                                        totalUpstream += getExcludedTco2(campaign, selectedExcludedData)[Scope.UPSTREAM];
                                        totalCore += getExcludedTco2(campaign, selectedExcludedData)[Scope.CORE];
                                        totalDownstream += getExcludedTco2(campaign, selectedExcludedData)[Scope.DOWNSTREAM];
                                        return (
                                            <td
                                                className={cx(styles.totalCampaignOnPerimeters)}
                                                style={{ textAlign: "center" }}
                                                key={campaign.id}
                                            >
                                                {reformatConvertToTons(
                                                    getExcludedTco2(campaign, selectedExcludedData)[Scope.UPSTREAM] +
                                                    getExcludedTco2(campaign, selectedExcludedData)[Scope.CORE] +
                                                    getExcludedTco2(campaign, selectedExcludedData)[Scope.DOWNSTREAM]
                                                )}
                                            </td>
                                        );
                                    })}
                                    <td key={perimeter.id} className={cx(styles.total, styles.totalCampaignOnPerimeters)}>
                                        {
                                            reformatConvertToTons(
                                                totalUpstream +
                                                totalCore +
                                                totalDownstream
                                            )
                                        }
                                    </td>
                                </>
                            )
                        })}
                        <td className={cx(styles.totalOnPerimeters)}>
                            {
                                reformatConvertToTons(
                                    totalOfScopes[Scope.UPSTREAM] +
                                    totalOfScopes[Scope.CORE] +
                                    totalOfScopes[Scope.DOWNSTREAM]
                                )
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default SynthesisTable;