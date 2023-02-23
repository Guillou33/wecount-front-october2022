import React from "react";
import styles from "@styles/perimeter/perimeterHome.module.scss";
import cx from 'classnames';

import { ActivityCategory } from "@reducers/core/categoryReducer";
import { PerimetersByEmission } from "@reducers/perimeter/perimeterReducer";

import { Scope } from "@custom-types/wecount-api/activity";
import { reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

import FoldableActivityModelRow from "./FoldableActivityModelRow";
import CategoriesEmissions from "./CategoriesEmissions";
import { totalCategories } from "@components/perimeter/helpers/totalCategories";
import { totalActivityModels } from "@components/perimeter/helpers/totalActivityModels";

import { AnimatePresence, motion, TargetAndTransition } from "framer-motion";

interface Props {
    showCategories: boolean;
    showActivityModels: boolean;
    setShowActivityModels: () => void;
    scope: Scope;
    category: ActivityCategory;
    perimeters: PerimetersByEmission;
    nonFilteredPerimeters: PerimetersByEmission;
    selectedExcludedData: number;
}

const opened: TargetAndTransition = {
    height: "70px",
    transitionEnd: {
      visibility: "visible",
    },
  };
  const folded: TargetAndTransition = {
    height: "0",
    visibility: "collapse",
  };

  const transition = { duration: 0.15, ease: "linear" }


const FoldableCategoryRow = ({
    showCategories,
    showActivityModels,
    setShowActivityModels,
    scope,
    category,
    perimeters,
    nonFilteredPerimeters,
    selectedExcludedData
}: Props) => { 

    return (
        <>
            <motion.tr
                className={cx(showCategories ? styles.rowCategoryOpened : styles.rowCategoryFolded)}
                initial={false}
                animate={showCategories ? opened : folded}
                transition={transition}
            >
                <td
                    className={cx(styles.titleCategoryCell)}
                    onClick={setShowActivityModels}
                >
                    <i className={`fas fa-chevron-${showActivityModels ? "down" : "right"}`}></i>{" "}
                    <p>{category.name}</p>
                </td>
                <CategoriesEmissions
                    scope={scope}
                    category={category}
                    perimeters={perimeters}
                    nonFilteredPerimeters={nonFilteredPerimeters}
                    selectedExcludedData={selectedExcludedData}
                />
                <td 
                    className={cx(styles.totalCategory)}
                >
                    {reformatConvertToTons(totalCategories(scope, perimeters,selectedExcludedData).totalOfCategories[category.id])}
                </td>
            </motion.tr>
            {category.activityModels.map(activityModel => {
                const total = totalActivityModels(scope, perimeters, selectedExcludedData).totalOfActivityModels[activityModel.id];
                return total === 0 || total === undefined ? (
                    <></>
                ) : (
                    <>
                        <FoldableActivityModelRow
                            key={activityModel.id}
                            showActivityModels={showActivityModels && showCategories}
                            scope={scope}
                            category={category}
                            activityModel={activityModel}
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

export default FoldableCategoryRow;