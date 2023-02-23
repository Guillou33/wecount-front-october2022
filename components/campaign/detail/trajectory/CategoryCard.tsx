import { useSelector } from "react-redux";
import cx from "classnames";

import { RootState } from "@reducers/index";
import { ActivityCategory, ActivityModel } from "@reducers/core/categoryReducer";
import { Scope } from "@custom-types/wecount-api/activity";
import { UnitModes } from "@reducers/campaignReducer";

import selectNotExcludedEntryInfoTotal from "@selectors/activityEntryInfo/selectNotExcludedEntryInfoTotal";
import selectActivityEntriesForTrajectory from "@selectors/activityEntries/selectActivityEntriesForTrajectory";
import selectFilteredActivityEntriesForCartography from "@selectors/activityEntries/selectFilteredActivityEntriesForCartography";
import selectNotExcludedEntryInfoByCategory from "@selectors/activityEntryInfo/selectNotExcludedEntryInfoByCategory";

import Tooltip from "@components/helpers/bootstrap/Tooltip";
import CounterBadge from "@components/core/CounterBadge";

import styles from "@styles/campaign/detail/sub/categoryCard.module.scss";

import { CategoryReductionInfo } from "@hooks/core/helpers/getReductionInfoByCategory";
import { ReductionField } from "./helpers/ReductionFields";
import { getTotalReductionActionPlansInActivityModelsInCategory } from "./utils/calculateActivityModelsActionPlan";
import { ReductionInfoByActivityModel } from "@hooks/core/helpers/getReductionInfoByActivityModel";
import { ProjectionViewItem } from "@components/campaign/detail/trajectory/helpers/TrajectoryTabItems";

interface Props {
    id: number;
    scope: Scope;
    preferencesFetched: boolean;
    isOpen: boolean;
    onClick?: () => void;
    className?: string;
    unitMode?: UnitModes;
    view: ProjectionViewItem;
    categoryReductionInfo: CategoryReductionInfo;
    activityModelsInCategory: ActivityModel[];
    activityModelReductionsInfo: ReductionInfoByActivityModel;
    nbrLevers: number;
}

const CategoryCard = ({
    id,
    scope,
    preferencesFetched,
    isOpen,
    onClick,
    className,
    unitMode = UnitModes.RAW,
    view,
    categoryReductionInfo,
    activityModelsInCategory,
    activityModelReductionsInfo,
    nbrLevers
}: Props) => {
    const category = useSelector<RootState, ActivityCategory>(
        state => state.core.category.categoryList[scope][id]
    );
    const campaignId = useSelector<RootState, number>(
        state => state.campaign.currentCampaign!
    );

    const customDescription = useSelector<RootState, string>(
        state =>
            state.userPreference.activityCategories[category.id]?.description ?? ""
    );

    const notExcludedEntries = useSelector((state: RootState) =>
        selectActivityEntriesForTrajectory(state, campaignId)
    );
    const entryInfoForCategory = useSelector((state: RootState) =>
        selectNotExcludedEntryInfoByCategory(state, notExcludedEntries)
    )[id];

    const entryInfoTotal = useSelector((state: RootState) =>
        selectNotExcludedEntryInfoTotal(state, notExcludedEntries)
    );

    return (
        <div
            onClick={onClick}
            className={cx(styles.category, className, { [styles.opened]: isOpen })}
        >
            <div className={styles.pictoContainer}>
                <img
                    className={styles.picto}
                    src={`/icons/categories/icon-${category.iconName ?? "energie"}.svg`}
                    alt=""
                />
                {nbrLevers > 0 && (
                    <div
                        className={cx(
                            styles.inProgressBadge,
                            styles[entryInfoForCategory.status]
                        )}
                    ></div>
                )}
            </div>
            <div className={styles.categoryName}>
                <p>{category.name}</p>
                {(nbrLevers && nbrLevers > 0) ? (
                    <span className={styles.activityNumber}>
                        &nbsp;({nbrLevers})
                    </span>
                ) : null}
                <div style={{ marginLeft: 5, marginBottom: 5 }}>
                    {category.description && (
                        <Tooltip
                            placement="top"
                            content={`${category.description ?? ""}`}
                            hideDelay={0}
                        >
                            <i
                                className={cx("fas fa-info-circle", styles.tooltipDescription)}
                            ></i>
                        </Tooltip>
                    )}
                </div>
                <div style={{ marginLeft: 5, marginBottom: 5 }}>
                    {customDescription && customDescription.length > 0 && (
                        <Tooltip
                            placement="top"
                            content={`${customDescription}`}
                            hideDelay={0}
                        >
                            <img src="/icons/modale/icon-comment.svg" />
                        </Tooltip>
                    )}
                </div>
            </div>

            {!preferencesFetched && (
                <span
                    className={cx("spinner-border text-secondary", styles.spinner)}
                ></span>
            )}
            {entryInfoForCategory.tCo2 ? (
                <CounterBadge
                    className={styles.categoryCounterBadge}
                    value={entryInfoForCategory.tCo2}
                    type={unitMode === UnitModes.PERCENT ? "percent" : "raw"}
                    totalValue={entryInfoTotal.tCo2}
                />
            ) : null}
            <ReductionField
                className={styles.reductionText}
                value={
                    view === ProjectionViewItem.CATEGORY ?
                        categoryReductionInfo.reductionPercentageOfScope :
                        getTotalReductionActionPlansInActivityModelsInCategory(
                            activityModelReductionsInfo,
                            activityModelsInCategory
                        )
                }
                alternativeValue={categoryReductionInfo.reductionTco2}
                scope={scope}
                type="light"
            />
        </div>
    );
};

export default CategoryCard;
