import styles from "@styles/perimeter/perimeterHome.module.scss";
import cx from 'classnames';

import { ActivityCategory, ActivityModel } from "@reducers/core/categoryReducer";
import { PerimetersByEmission } from "@reducers/perimeter/perimeterReducer";

import { Scope } from "@custom-types/wecount-api/activity";
import { formatPercentageDisplay, reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

import { getTotalScopes } from "@components/perimeter/helpers/totalScopes";
import ActivityModelsPercentages from "./ActivityModelsPercentages";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import { totalActivityModels } from "@components/perimeter/helpers/totalActivityModels";

import { motion, TargetAndTransition } from "framer-motion";
import { t } from "i18next";
import _ from "lodash";
import { RootState } from "@reducers/index";
import { useSelector } from "react-redux";

interface Props {
    showActivityModels: boolean;
    scope: Scope;
    category: ActivityCategory;
    activityModel: ActivityModel;
    perimeters: PerimetersByEmission;
    nonFilteredPerimeters: PerimetersByEmission;
}

const opened: TargetAndTransition = {
    height: "50px",
    transitionEnd: {
      visibility: "visible",
    },
};
const folded: TargetAndTransition = {
    height: "0",
    visibility: "collapse",
};

  const transition = { duration: 0.15, ease: "linear" }
  
const FoldableActivityModelRow = ({
    showActivityModels,
    scope,
    category,
    activityModel,
    perimeters,
    nonFilteredPerimeters
}: Props) => {
    const selectedExcludedData = useSelector<RootState, number>(
      state => state.perimeter.synthesis.display.excluded
    );
    
    const totalOfScopes = getTotalScopes(perimeters, selectedExcludedData);

    const totalOfNonFilteredScopes = getTotalScopes(nonFilteredPerimeters, selectedExcludedData);

    return (
        <>
            <motion.tr
                className={cx(styles.rowActivityModel)}
                initial={false}
                animate={showActivityModels ? opened : folded}
                transition={transition}
            >
                <td
                    className={cx(styles.titleActivityModelCell)}
                >
                    {activityModel.name}
                </td>
                <ActivityModelsPercentages
                    scope={scope}
                    category={category}
                    activityModel={activityModel}
                    perimeters={perimeters}
                    nonFilteredPerimeters={nonFilteredPerimeters}
                />
                <Tooltip hideDelay={100} showDelay={100} content={`${formatPercentageDisplay(
                    totalActivityModels(scope, nonFilteredPerimeters, selectedExcludedData).totalOfActivityModels[activityModel.id], (
                        totalOfNonFilteredScopes[Scope.UPSTREAM] +
                        totalOfNonFilteredScopes[Scope.CORE] +
                        totalOfNonFilteredScopes[Scope.DOWNSTREAM]
                ))}% ${t("perimeter.synthesis.onAllPerimeters")}`}>
                    <td className={cx(styles.totalActivityModel)}>
                        {formatPercentageDisplay(totalActivityModels(scope, perimeters, selectedExcludedData).totalOfActivityModels[activityModel.id], 
                            totalOfScopes[Scope.UPSTREAM] +
                            totalOfScopes[Scope.CORE] +
                            totalOfScopes[Scope.DOWNSTREAM]
                        )}%
                    </td>
                </Tooltip>
            </motion.tr>
        </>

    );
}

export default FoldableActivityModelRow;