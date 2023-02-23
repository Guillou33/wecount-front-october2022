import { useSelector } from "react-redux";
import cx from "classnames";

import { RootState } from "@reducers/index";
import { ActivityCategory } from "@reducers/core/categoryReducer";
import { Scope } from "@custom-types/wecount-api/activity";
import { UnitModes } from "@reducers/campaignReducer";

import selectEntryInfoTotal from "@selectors/activityEntryInfo/selectEntryInfoTotal";
import selectActivityEntriesOfCampaign from "@selectors/activityEntries/selectActivityEntriesOfCampaign";
import selectFilteredActivityEntriesForCartography from "@selectors/activityEntries/selectFilteredActivityEntriesForCartography";
import selectEntryInfoByCategory from "@selectors/activityEntryInfo/selectEntryInfoByCategory";

import Tooltip from "@components/helpers/bootstrap/Tooltip";
import CounterBadge from "@components/core/CounterBadge";

import styles from "@styles/campaign/detail/sub/categoryCard.module.scss";

interface Props {
  id: number;
  scope: Scope;
  preferencesFetched: boolean;
  isOpen: boolean;
  onClick?: () => void;
  className?: string;
  unitMode?: UnitModes;
}

const CategoryCard = ({
  id,
  scope,
  preferencesFetched,
  isOpen,
  onClick,
  className,
  unitMode = UnitModes.RAW,
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

  const filteredEntries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForCartography(state, campaignId)
  );
  const entryInfoForCategory = useSelector((state: RootState) =>
    selectEntryInfoByCategory(state, filteredEntries)
  )[id];

  const allEntries = useSelector((state: RootState) =>
    selectActivityEntriesOfCampaign(state, campaignId)
  );
  const entryInfoTotal = useSelector((state: RootState) =>
    selectEntryInfoTotal(state, allEntries)
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
        {entryInfoForCategory.nb > 0 && (
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
        {entryInfoForCategory.nb ? (
          <span className={styles.activityNumber}>
            &nbsp;({entryInfoForCategory.nb})
          </span>
        ) : null}
        <div style={{ marginLeft: 5 }}>
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
        <div style={{ marginLeft: 5 }}>
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
        {entryInfoForCategory.tCo2 ? (
          <CounterBadge
            className={styles.categoryCounterBadge}
            value={entryInfoForCategory.tCo2}
            type={unitMode === UnitModes.PERCENT ? "percent" : "raw"}
            totalValue={entryInfoTotal.tCo2}
          />
        ) : null}
      </div>

      {!preferencesFetched && (
        <span
          className={cx("spinner-border text-secondary", styles.spinner)}
        ></span>
      )}
    </div>
  );
};

export default CategoryCard;
