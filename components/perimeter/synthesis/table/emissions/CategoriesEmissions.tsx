import cx from 'classnames';
import styles from "@styles/perimeter/perimeterHome.module.scss";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

import { ActivityCategory, CategoryList } from "@reducers/core/categoryReducer";
import { PerimetersByEmission, ScopeEmissions } from "@reducers/perimeter/perimeterReducer";

import { Scope } from "@custom-types/wecount-api/activity";

import { getExcludedTco2, totalCategories } from "@components/perimeter/helpers/totalCategories";

import _, { upperFirst } from "lodash";

interface Props {
    scope: Scope;
    category: ActivityCategory;
    perimeters: PerimetersByEmission;
    nonFilteredPerimeters: PerimetersByEmission;
    selectedExcludedData: number;
}

const CategoriesEmissions = ({
    scope,
    category,
    perimeters,
    nonFilteredPerimeters,
    selectedExcludedData
}: Props) => {

    const renderNoEmission = (index: number) => {
        return (
            <td
                key={index}
                style={{textAlign: "center"}}
                className={cx(styles.emissionCell)}
            >
                {"-"}
            </td>
        )
    }

    const renderRow = () => {
        return Object.values(perimeters).map(perimeter => {
            const totalTco2 = totalCategories(scope, perimeters, selectedExcludedData).totalOfCategoriesInPerimeter[perimeter.id];
            return (
                <>
                    {Object.values(perimeter.campaigns).map(campaign => {
                        if(campaign.scopes === undefined){ 
                            return renderNoEmission(campaign.id);
                        }else if(campaign.scopes[scope].categories[category.id] === undefined){
                            return renderNoEmission(campaign.id);
                        }
                        const tco2 = getExcludedTco2(campaign.scopes[scope].categories[category.id], selectedExcludedData);
                        return tco2 === 0 || tco2 === undefined ? 
                            renderNoEmission(campaign.id)
                         : (
                            <td
                                key={campaign.id}
                                style={{textAlign: "center"}}
                                className={cx(styles.emissionCell)}
                            >
                                {reformatConvertToTons(tco2)}
                            </td>
                        );
                    })}
                    <td
                        className={cx(styles.totalCategory)}
                        key={perimeter.id}
                    >
                    {totalTco2 === undefined || totalTco2[category.id] === undefined ||totalTco2[category.id] === 0 ? 
                        "-" :
                        reformatConvertToTons(totalCategories(scope, perimeters, selectedExcludedData).totalOfCategoriesInPerimeter[perimeter.id][category.id])
                    }
                    </td>
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

export default CategoriesEmissions;

