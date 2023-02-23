import ActivityModel from "@components/campaign/detail/dashboard/ActivityModel";
import { Scope } from "@custom-types/wecount-api/activity";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { RootState } from "@reducers/index";
import { UnitModes } from "@reducers/campaignReducer";
import _ from "lodash";
import cx from "classnames";
import styles from "@styles/campaign/detail/dashboard/category.module.scss";
import Foldable from "@components/helpers/form/Foldable";
import { toggleCard } from "@actions/cardExpansion/cardExpansionActions";

import selectFilteredActivityModelIds from "@selectors/activityModels/selectFilteredActivityModelIds";
import selectIsCartographyFiltered from "@selectors/filters/selectIsCartographyFiltered";
import { ActivityModel as ActivityModelType } from "@reducers/core/categoryReducer";
import selectIsCardOpened from "@selectors/cardExpansion/selectIsCardOpened";
import { CardExpansionNames } from "@reducers/cardExpansion/cardExpansionReducer";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import selectCartographyForCampaign from "@selectors/cartography/selectCartographyForCampaign";

import CategoryCard from "@components/campaign/detail/sub/CategoryCard";

interface Props {
  scope: Scope;
  id: number;
  preferencesFetched: boolean;
  className?: string;
}

const Category = ({ className, ...props }: Props) => {
  const dispatch = useDispatch();
  const campaignId = useSelector<RootState, number>(
    state => state.campaign.currentCampaign!
  );

  const isCollaborator = useUserHasPerimeterRole(
    PerimeterRole.PERIMETER_COLLABORATOR
  );

  const scopeClass = _.lowerCase(props.scope);

  const cartography = useSelector((state: RootState) =>
    selectCartographyForCampaign(state, campaignId)
  );

  const category = cartography[props.scope][props.id];

  const isCartographyFiltered = useSelector(selectIsCartographyFiltered);
  const filteredActivityModels = useSelector((state: RootState) =>
    selectFilteredActivityModelIds(state, campaignId)
  );

  const unitMode = useSelector<RootState, UnitModes>(
    state => state.campaign.campaigns[campaignId]?.unitMode ?? UnitModes.RAW
  );

  const isOpen = useSelector<RootState, boolean>(state =>
    selectIsCardOpened(
      state,
      CardExpansionNames.CARTOGRAPHY,
      category.id.toString()
    )
  );

  const onCategoryClick = () => {
    dispatch(
      toggleCard({
        cardExpansionName: CardExpansionNames.CARTOGRAPHY,
        cardId: category.id.toString(),
      })
    );
  };

  const [closeComplete, setCloseComplete] = useState(true);

  function showActivityModel(activityModel: ActivityModelType): boolean {
    if (
      (!isCartographyFiltered && isCollaborator) ||
      filteredActivityModels == null
    ) {
      return true;
    }
    return filteredActivityModels[activityModel.id];
  }

  const renderActivityModels = () => {
    const activityModels = category.activityModels
      .filter(activityModel => showActivityModel(activityModel))
      .map(activityModel => {
        return (
          <ActivityModel
            key={activityModel.id}
            id={activityModel.id}
          />
        );
      });

    const activityModelsWrapped = (
      <div className={styles.activityModelsContainer}>{activityModels}</div>
    );
    return (
      <Foldable isOpen={isOpen} onCloseComplete={() => setCloseComplete(true)}>
        {activityModelsWrapped}
      </Foldable>
    );
  };

  return (
    <div
      className={cx(styles.categoryContainer, styles[scopeClass], className, {
        [styles.open]: isOpen || !closeComplete,
      })}
    >
      <CategoryCard
        onClick={onCategoryClick}
        id={category.id}
        isOpen={isOpen || !closeComplete}
        preferencesFetched={props.preferencesFetched}
        scope={props.scope}
        className={styles.category}
        unitMode={unitMode}
      />
      {renderActivityModels()}

      {isOpen && (
        <div
          onClick={onCategoryClick}
          style={{
            cursor: "pointer",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "30px",
            // backgroundColor: isOpen ? "darken($color-primary-1, 5%)" : "white"
          }}
        >
          <i className={`fas fa-chevron-${isOpen ? "up" : "down"}`}></i>
        </div>
      )}
    </div>
  );
};

export default Category;
