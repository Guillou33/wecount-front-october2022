import styles from "@styles/perimeter/perimeterHome.module.scss";
import cx from 'classnames';

import { ActivityCategory, ActivityModel } from "@reducers/core/categoryReducer";
import { PerimetersByEmission } from "@reducers/perimeter/perimeterReducer";

import { Scope } from "@custom-types/wecount-api/activity";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

import ActivityModelsEmissions from "./ActivityModelsEmissions";
import { totalActivityModels } from "@components/perimeter/helpers/totalActivityModels";

import { motion, TargetAndTransition } from "framer-motion";

interface Props {
    showActivityModels: boolean;
    scope: Scope;
    category: ActivityCategory;
    activityModel: ActivityModel;
    perimeters: PerimetersByEmission;
    nonFilteredPerimeters: PerimetersByEmission;
    selectedExcludedData: number;
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
    nonFilteredPerimeters,
    selectedExcludedData
}: Props) => {
    const totalTco2 = totalActivityModels(scope, perimeters, selectedExcludedData).totalOfActivityModels[activityModel.id];
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
                <ActivityModelsEmissions
                    scope={scope}
                    category={category}
                    activityModel={activityModel}
                    perimeters={perimeters}
                    nonFilteredPerimeters={nonFilteredPerimeters}
                    selectedExcludedData={selectedExcludedData}
                />
                <td className={cx(styles.totalActivityModel)}>
                    {totalTco2 === undefined || totalTco2 === 0 ? 
                        "-" : 
                        reformatConvertToTons(totalActivityModels(scope, perimeters, selectedExcludedData).totalOfActivityModels[activityModel.id])
                    }
                </td>
            </motion.tr>
        </>

    );
}

export default FoldableActivityModelRow;