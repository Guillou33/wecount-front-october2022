import cx from 'classnames';
import styles from "@styles/perimeter/perimeterHome.module.scss";

import { ActivityCategory, ActivityModel } from "@reducers/core/categoryReducer";
import { PerimetersByEmission } from "@reducers/perimeter/perimeterReducer";

import { Scope } from "@custom-types/wecount-api/activity";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

import { getExcludedTco2, totalActivityModels } from "@components/perimeter/helpers/totalActivityModels";

interface Props {
    scope: Scope;
    category: ActivityCategory;
    activityModel: ActivityModel;
    perimeters: PerimetersByEmission;
    nonFilteredPerimeters: PerimetersByEmission;
    selectedExcludedData: number;
}

const ActivityModelsEmissions = ({
    scope,
    category,
    activityModel,
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
            const totalTco2 = totalActivityModels(scope, perimeters, selectedExcludedData).totalOfActivityModelsInPerimeter[perimeter.id];
            return (
                <>
                    {Object.values(perimeter.campaigns).map(campaign => {
                        if(campaign.scopes === undefined){ 
                            return renderNoEmission(campaign.id);
                        }else if(campaign.scopes[scope].categories[category.id] === undefined){
                            return renderNoEmission(campaign.id);
                        }else if(campaign.scopes[scope].categories[category.id].activityModels[activityModel.id] === undefined){
                            return renderNoEmission(campaign.id);
                        }
                        const tco2 = getExcludedTco2(campaign.scopes[scope].categories[category.id].activityModels[activityModel.id], selectedExcludedData);
                        return tco2 === 0 || tco2 === undefined ? renderNoEmission(campaign.id) : (
                            <td
                                key={campaign.id}
                                style={{textAlign: "center"}}
                                className={cx(styles.emissionCell)}
                            >
                                {reformatConvertToTons(tco2)}
                            </td>
                        );
                    })}
                    <td className={cx(styles.totalActivityModel)} key={perimeter.id}>
                        {totalTco2 === undefined || totalTco2[activityModel.id] === undefined || totalTco2[activityModel.id] === 0 ? 
                            "-" : 
                            reformatConvertToTons(totalActivityModels(scope, perimeters, selectedExcludedData).totalOfActivityModelsInPerimeter[perimeter.id][activityModel.id])                        
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

export default ActivityModelsEmissions;