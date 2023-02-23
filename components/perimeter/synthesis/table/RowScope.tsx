import React from "react";
import styles from "@styles/perimeter/perimeterHome.module.scss";
import cx from 'classnames';
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";

import { setShowActivityModelsEmissions } from "@actions/perimeter/perimeterActions";
import { PerimetersByEmission, ShowActivityModelsInTable } from "@reducers/perimeter/perimeterReducer";
import { CategoryList } from "@reducers/core/categoryReducer";

import { Scope } from "@custom-types/wecount-api/activity";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

import { getTotalScopes, getTotalScopesOfPerimeters } from "@components/perimeter/helpers/totalScopes";
import FoldableCategoryRow from "./emissions/FoldableCategoryRow";
import { totalCategories } from "@components/perimeter/helpers/totalCategories";
import { getScopeText, getTco2CampaignScope } from "@components/perimeter/helpers/getScopeProps";

import { t } from "i18next";

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

const RowScope = ({
    scope,
    perimeters,
    nonFilteredPerimeters,
    categoryList,
    showCategories,
    showActivityModels,
    setShowCategories,
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
                        <p>{getScopeText(scope)} ({t("footprint.emission.tons")})</p>
                    </td>
                    {Object.values(perimeters).map(perimeter => {
                        const total = totalOfScopesInPerimeters[perimeter.id][scope].emission;
                        return (
                            <>
                                {Object.values(perimeter.campaigns).map(campaign => {
                                    return (
                                        <td
                                            key={campaign.id}
                                            className={cx(styles.emissionCell)}
                                        >
                                            {
                                                getTco2CampaignScope(scope, campaign, selectedExcludedData) === 0 ? 
                                                    renderNoEmission(campaign.id) : 
                                                    reformatConvertToTons(getTco2CampaignScope(scope, campaign, selectedExcludedData))
                                            }
                                        </td>
                                    );
                                })}
                                <td className={cx(styles.total)} key={perimeter.id}>
                                    {
                                        total === undefined || total === 0 ? 
                                            renderNoEmission(perimeter.id) : 
                                            reformatConvertToTons(
                                                totalOfScopesInPerimeters[perimeter.id][scope].emission
                                            )
                                    }
                                </td>
                            </>
                        )
                    })}
                    <td className={cx(styles.total, styles.totalScope)}>
                        {reformatConvertToTons(totalOfScopes[scope])}
                    </td>
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
                                setShowActivityModels={() => dispatch(setShowActivityModelsEmissions({
                                    ...showActivityModels,
                                    [category.id]: !showActivityModels[category.id]
                                }))}
                                scope={scope}
                                category={category}
                                perimeters={perimeters}
                                nonFilteredPerimeters={nonFilteredPerimeters}
                                selectedExcludedData={selectedExcludedData}
                            />
                        </>
                    )
                })}
            </>
        );

}

export default RowScope;