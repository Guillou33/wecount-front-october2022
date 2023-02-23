import { RootState } from "@reducers/index"
import { CategoryProjectionPossibleView } from "@reducers/trajectory/currentTrajectory/currentTrajectoryReducer"
import { useSelector } from "react-redux"

const useCategoriesLevelDefinition = (trajectoryId: number) => {
    const categoryProjectionsViews = useSelector<RootState, CategoryProjectionPossibleView[]>(
        state => state.trajectory.currentTrajectory.categoryProjectionsViews[trajectoryId]
    );

    return categoryProjectionsViews;
}
export default useCategoriesLevelDefinition;