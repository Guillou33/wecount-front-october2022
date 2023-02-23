
import React from "react";
import styles from "@styles/perimeter/perimeterHome.module.scss";
import cx from 'classnames';

import { ActivityCategory } from "@reducers/core/categoryReducer";
import { PerimetersByEmission } from "@reducers/perimeter/perimeterReducer";

import { Scope } from "@custom-types/wecount-api/activity";
import { formatPercentageDisplay, reformatConvertToTons } from "@lib/core/campaign/getEmissionNumbers";

import FoldableActivityModelRow from "./FoldableActivityModelRow";
import { getTotalScopes } from "@components/perimeter/helpers/totalScopes";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import CategoriesPercentages from "./CategoriesPercentages";
import { totalCategories } from "@components/perimeter/helpers/totalCategories";
import { totalActivityModels } from "@components/perimeter/helpers/totalActivityModels";

import { AnimatePresence, motion, TargetAndTransition } from "framer-motion";
import { t } from "i18next";
import _ from "lodash";
import { RootState } from "@reducers/index";
import { useSelector } from "react-redux";

interface Props {
    showCategories: boolean;
    showActivityModels: boolean;
    setShowActivityModels: () => void;
    scope: Scope;
    category: ActivityCategory;
    perimeters: PerimetersByEmission;
    nonFilteredPerimeters: PerimetersByEmission;
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
                <CategoriesPercentages
                    scope={scope}
                    category={category}
                    perimeters={perimeters}
                    nonFilteredPerimeters={nonFilteredPerimeters}
                />
                <Tooltip hideDelay={100} showDelay={100} content={`${formatPercentageDisplay(
                    totalCategories(scope, nonFilteredPerimeters, selectedExcludedData).totalOfCategories[category.id], (
                    totalOfNonFilteredScopes[Scope.UPSTREAM] +
                    totalOfNonFilteredScopes[Scope.CORE] +
                    totalOfNonFilteredScopes[Scope.DOWNSTREAM]
                ))}% ${t("perimeter.synthesis.onAllPerimeters")}`}>
                    <td 
                        className={cx(styles.totalCategory)}
                    >
                        {formatPercentageDisplay(totalCategories(scope, perimeters,selectedExcludedData).totalOfCategories[category.id], 
                            totalOfScopes[Scope.UPSTREAM] +
                            totalOfScopes[Scope.CORE] +
                            totalOfScopes[Scope.DOWNSTREAM]
                        )}%
                    </td>
                </Tooltip>
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
                        />
                    </>
                )
            })}
        </>
    );
}

export default FoldableCategoryRow;