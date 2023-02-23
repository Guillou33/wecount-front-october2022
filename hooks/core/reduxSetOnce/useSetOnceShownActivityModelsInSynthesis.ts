import { RootState } from "@reducers/index";
import { CategoryList } from "@reducers/core/categoryReducer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShowActivityModelsInTable } from "@reducers/perimeter/perimeterReducer";
import { Scope } from "@custom-types/wecount-api/activity";
import _ from "lodash";
import { setShowActivityModelsEmissions, setShowActivityModelsPercentages } from "@actions/perimeter/perimeterActions";

export const fillShownActivityModels = (categoryList: CategoryList) => {
    let showActivityModelsInTable: ShowActivityModelsInTable = {};
    Object.values(categoryList[Scope.UPSTREAM]).forEach(category => {
        showActivityModelsInTable[category.id] = false;
    });
    Object.values(categoryList[Scope.CORE]).forEach(category => {
        showActivityModelsInTable[category.id] = false;
    });
    Object.values(categoryList[Scope.DOWNSTREAM]).forEach(category => {
        showActivityModelsInTable[category.id] = false;
    });
    return showActivityModelsInTable;
}

export const useSetOnceShownActivityModelsInSynthesis = (showActivityModels: ShowActivityModelsInTable) => {
    const dispatch = useDispatch();
    const categoryList = useSelector<RootState, CategoryList>(
        state => state.core.category.categoryList
    );

    useEffect(() => {
        if(_.isEmpty(showActivityModels)){
            dispatch(setShowActivityModelsEmissions(fillShownActivityModels(categoryList)));
            dispatch(setShowActivityModelsPercentages(fillShownActivityModels(categoryList)));
        }
    }, [showActivityModels]);
}