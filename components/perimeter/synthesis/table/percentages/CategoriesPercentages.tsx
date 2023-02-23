
import cx from 'classnames';
import styles from "@styles/perimeter/perimeterHome.module.scss";

import { ActivityCategory, CategoryList } from "@reducers/core/categoryReducer";
import { PerimetersByEmission, ScopeEmissions } from "@reducers/perimeter/perimeterReducer";

import { Scope } from "@custom-types/wecount-api/activity";
import { formatPercentageDisplay, reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

import { getTotalScopes, getTotalScopesOfPerimeters } from "@components/perimeter/helpers/totalScopes";
import { scopeLabelsDiminutive } from "@components/campaign/detail/trajectory/utils/scopeLabels";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import { getExcludedTco2, totalCategories } from "@components/perimeter/helpers/totalCategories";

import _, { upperFirst } from "lodash";
import { t } from "i18next";
import { useSelector } from 'react-redux';
import { RootState } from '@reducers/index';

interface Props {
    scope: Scope;
    category: ActivityCategory;
    perimeters: PerimetersByEmission;
    nonFilteredPerimeters: PerimetersByEmission;
}

const CategoriesPercentages = ({
    scope,
    category,
    perimeters,
    nonFilteredPerimeters,
}: Props) => {
    const selectedExcludedData = useSelector<RootState, number>(
      state => state.perimeter.synthesis.display.excluded
    );

    const totalOfScopes = getTotalScopes(perimeters,selectedExcludedData);

    const totalOfNonFilteredScopes = getTotalScopes(nonFilteredPerimeters, selectedExcludedData);

    const renderNoEmission = (index: number) => {
        return (
            <td
                key={index}
                style={{ textAlign: "center" }}
                className={cx(styles.emissionCell)}
            >
                {"-"}
            </td>
        )
    }

    const renderRow = () => {
        return Object.values(perimeters).map(perimeter => {
            const totalTco2 = totalCategories(scope, perimeters,selectedExcludedData).totalOfCategoriesInPerimeter[perimeter.id];
            return (
                <>
                    {Object.values(perimeter.campaigns).map(campaign => {
                        if (campaign.scopes === undefined) {
                            return renderNoEmission(campaign.id);
                        } else if (campaign.scopes[scope].categories[category.id] === undefined) {
                            return renderNoEmission(campaign.id);
                        }
                        const tco2 = getExcludedTco2(campaign.scopes[scope].categories[category.id], selectedExcludedData);
                        
                        return tco2 === 0 || tco2 === undefined ?
                            renderNoEmission(campaign.id)
                            : (
                                <Tooltip key={campaign.id} hideDelay={100} showDelay={100} content={
                                    `${formatPercentageDisplay(tco2, totalOfNonFilteredScopes[scope])}% 
                                    ${t("perimeter.synthesis.onScope", {scope: scopeLabelsDiminutive[scope]})}
                                `}>
                                    <td
                                        key={campaign.id}
                                        style={{ textAlign: "center" }}
                                        className={cx(styles.emissionCell)}
                                    >
                                        {formatPercentageDisplay(tco2, totalOfScopes[scope])}%
                                    </td>
                                </Tooltip>
                            );
                    })}
                    <Tooltip key={perimeter.id} hideDelay={100} showDelay={100} content={
                        totalTco2 === undefined || totalTco2[category.id] === undefined || totalTco2[category.id] === 0 ?
                        "-" :
                        `${formatPercentageDisplay(totalTco2[category.id], totalOfNonFilteredScopes[scope])}% 
                        ${t("perimeter.synthesis.onScope", {scope: scopeLabelsDiminutive[scope]})}
                    `}>
                        <td
                            className={cx(styles.totalCategory)}
                        >
                            {totalTco2 === undefined || totalTco2[category.id] === undefined || totalTco2[category.id] === 0 ?
                                "-" :
                                `${formatPercentageDisplay(totalTco2[category.id], totalOfScopes[scope])}%`
                            }
                        </td>
                    </Tooltip>
                </>
            )
        })
    }

    return (
        <>
            {renderRow()}
        </>
    );
}

export default CategoriesPercentages;

