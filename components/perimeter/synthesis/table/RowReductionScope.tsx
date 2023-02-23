import React from "react";
import styles from "@styles/perimeter/perimeterHome.module.scss";
import cx from 'classnames';
import { useDispatch, useSelector } from "react-redux";

import { setShowActivityModelsPercentages, setShowCategoriesPercentages } from "@actions/perimeter/perimeterActions";
import { PerimetersByEmission, ShowActivityModelsInTable } from "@reducers/perimeter/perimeterReducer";
import { CategoryList } from "@reducers/core/categoryReducer";

import { Scope } from "@custom-types/wecount-api/activity";
import { formatPercentageDisplay } from "@lib/core/campaign/getEmissionNumbers";

import { getScopeText, getTco2CampaignScope } from "@components/perimeter/helpers/getScopeProps";
import { scopeLabelsDiminutive } from "@components/campaign/detail/trajectory/utils/scopeLabels";
import { getTotalScopes, getTotalScopesOfPerimeters } from "@components/perimeter/helpers/totalScopes";
import FoldableCategoryRow from "./percentages/FoldableCategoryRow";
import { totalCategories } from "@components/perimeter/helpers/totalCategories";
import Tooltip from "@components/helpers/bootstrap/Tooltip";

import _ from "lodash";
import { t } from "i18next";
import { RootState } from "@reducers/index";

interface Props {
    scope: Scope;
    perimeters: PerimetersByEmission;
    nonFilteredPerimeters: PerimetersByEmission;
    categoryList: CategoryList;
    showCategories: {
        [Scope.UPSTREAM]: boolean,
        [Scope.CORE]: boolean,
        [Scope.DOWNSTREAM]: boolean
    };
    showActivityModels: ShowActivityModelsInTable;
    setShowCategories: () => void;
}

const RowReductionScope = ({
    scope,
    perimeters, 
    nonFilteredPerimeters,
    categoryList,
    showCategories,
    showActivityModels,
    setShowCategories
}: Props) => {
    const dispatch = useDispatch();
    
    const selectedExcludedData = useSelector<RootState, number>(
        state => state.perimeter.synthesis.display.excluded
    );
      
    const renderNoEmission = (index: number) => {
        return "-";
    }

    const totalOfScopes = getTotalScopes(perimeters, selectedExcludedData);
    const totalOfScopesInPerimeters = getTotalScopesOfPerimeters(perimeters, selectedExcludedData);

    const totalOfNonFilteredScopes = getTotalScopes(nonFilteredPerimeters, selectedExcludedData);
    const totalOfScopesInNonFilteredPerimeters = getTotalScopesOfPerimeters(nonFilteredPerimeters, selectedExcludedData);
    
    return (
        <>
            <tr
                className={cx(styles.rowScope)}
            >
                <td 
                    className={cx(styles.titleScopeCell)}
                    onClick={setShowCategories}
                >
                    {totalOfScopes[scope] !== 0 && <i className={`fas fa-chevron-${showCategories[scope] ? "down" : "right"}`}></i>}{" "}
                    <p>{getScopeText(scope)} ({t("perimeter.synthesis.percentTotalOnScope", {scope: scopeLabelsDiminutive[scope]})})</p>
                </td>
                {Object.values(perimeters).map(perimeter => {
                    const total = totalOfScopesInPerimeters[perimeter.id][scope].emission;
                    return (
                        <>
                            {Object.values(perimeter.campaigns).map(campaign => {
                                return (
                                    <Tooltip key={campaign.id} hideDelay={100} showDelay={100} content={
                                        getTco2CampaignScope(scope, campaign, selectedExcludedData) === 0 ? "-" :
                                            `${formatPercentageDisplay(getTco2CampaignScope(scope, campaign, selectedExcludedData), totalOfNonFilteredScopes[scope])}% 
                                            ${t("perimeter.synthesis.onScope",  {scope: scopeLabelsDiminutive[scope]})}`
                                    }>
                                        <td
                                            style={{ textAlign: "center" }}
                                            key={campaign.id}
                                            className={cx(styles.emissionCell)}
                                        >
                                            {getTco2CampaignScope(scope, campaign, selectedExcludedData) === 0 ? "-" :
                                                `${formatPercentageDisplay(getTco2CampaignScope(scope, campaign, selectedExcludedData), totalOfScopes[scope])}%`
                                            }
                                        </td>
                                    </Tooltip>
                                );
                            })}
                            <Tooltip key={perimeter.id} hideDelay={100} showDelay={100} content={
                                total === undefined || total === 0 ?
                                    renderNoEmission(perimeter.id) : 
                                    `${totalOfScopesInNonFilteredPerimeters[perimeter.id][scope].percentage}% 
                                    ${t("perimeter.synthesis.onScope",  {scope: scopeLabelsDiminutive[scope]})}`
                            } >
                                <td className={cx(styles.total)} key={perimeter.id}>
                                    {total === undefined || total === 0 ?
                                        renderNoEmission(perimeter.id) : 
                                        `${totalOfScopesInPerimeters[perimeter.id][scope].percentage}%`
                                    }
                                </td>
                            </Tooltip>
                        </>
                    )
                })}
                <Tooltip hideDelay={100} showDelay={100} content={`${formatPercentageDisplay(
                    totalOfNonFilteredScopes[scope], (
                    totalOfNonFilteredScopes[Scope.UPSTREAM] +
                    totalOfNonFilteredScopes[Scope.CORE] +
                    totalOfNonFilteredScopes[Scope.DOWNSTREAM]
                ))}% ${t("perimeter.synthesis.onAllPerimeters")}`}>
                    <td className={cx(styles.total, styles.totalScope)}>
                        {formatPercentageDisplay(
                            totalOfScopes[scope], (
                            totalOfScopes[Scope.UPSTREAM] +
                            totalOfScopes[Scope.CORE] +
                            totalOfScopes[Scope.DOWNSTREAM]
                        )
                        )}%
                    </td>
                </Tooltip>
            </tr>
            {Object.values(categoryList[scope]).map(category => {
                const total = totalCategories(scope, perimeters, selectedExcludedData).totalOfCategories[category.id];
                return total === 0 || total === undefined ? (
                    <></>
                ) : (
                    <>
                        <FoldableCategoryRow
                            key={category.id}
                            showCategories={showCategories[scope]}
                            showActivityModels={showActivityModels[category.id]}
                            setShowActivityModels={() => dispatch(setShowActivityModelsPercentages({
                                ...showActivityModels,
                                [category.id]: !showActivityModels[category.id]
                            }))}
                            scope={scope}
                            category={category}
                            perimeters={perimeters}
                            nonFilteredPerimeters={nonFilteredPerimeters}
                        />
                    </>
                )
            })}
        </>
    )
}

export default RowReductionScope;