import cx from "classnames";
import styles from "@styles/campaign/detail/dashboard/scopes.module.scss";
import { useSelector } from "react-redux";
import { Scope } from "@custom-types/wecount-api/activity";
import { RootState } from "@reducers/index";
import Category from "@components/campaign/detail/dashboard/Category";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import _, { upperFirst } from "lodash";
import { UnitModes } from "@reducers/campaignReducer";
import { ActivityCategoryPreferencesState } from "@reducers/userPreference/activityCategoriesReducer";
import selectFilteredCategories from "@selectors/category/selectFilteredCategories";
import selectIsCartographyFiltered from "@selectors/filters/selectIsCartographyFiltered";
import { ActivityCategory } from "@reducers/core/categoryReducer";
import ResultDisplayer from "@components/core/ResultDisplayer";
import useUserHasPerimeterRole from "@hooks/core/perimeterAccessControl/useUserHasPerimeterRole";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import EntriesResultRecap from "@components/campaign/detail/sub/EntriesResultRecap";

import selectEntryInfoByScope from "@selectors/activityEntryInfo/selectEntryInfoByScope";
import selectFilteredActivityEntriesForCartography from "@selectors/activityEntries/selectFilteredActivityEntriesForCartography";
import selectCartographyForCampaign from "@selectors/cartography/selectCartographyForCampaign";

import useAllEntriesInfoTotal from "@hooks/core/activityEntryInfo/useAllEntriesInfoTotal";
import { t } from "i18next";

const Scopes = () => {
  const campaignId = useSelector<RootState, number>(
    // Set in getInitialProps
    state => state.campaign.currentCampaign!
  );

  const isCollaborator = useUserHasPerimeterRole(
    PerimeterRole.PERIMETER_COLLABORATOR
  );

  const cartography = useSelector((state: RootState) =>
    selectCartographyForCampaign(state, campaignId)
  );

  const entryInfoTotal = useAllEntriesInfoTotal(campaignId);

  const filteredEntries = useSelector((state: RootState) =>
    selectFilteredActivityEntriesForCartography(state, campaignId)
  );
  const entryInfoByScope = useSelector((state: RootState) =>
    selectEntryInfoByScope(state, filteredEntries)
  );

  const unitMode = useSelector<RootState, UnitModes>(
    state => state.campaign.campaigns[campaignId]?.unitMode ?? UnitModes.RAW
  );

  const categoriesPreferences = useSelector<
    RootState,
    ActivityCategoryPreferencesState
  >(state => state.userPreference.activityCategories);

  const filteredCategories = useSelector((state: RootState) =>
    selectFilteredCategories(state, campaignId)
  );

  const isCartographyFiltered = useSelector(selectIsCartographyFiltered);

  function showCategory(category: ActivityCategory) {
    if (
      (!isCartographyFiltered && isCollaborator) ||
      filteredCategories == null
    ) {
      return true;
    }
    return filteredCategories[category.id];
  }

  const renderCategories = (scope: Scope) => {
    const currentCategories = cartography[scope];
    const visibleCategoriesSorted = Object.values(currentCategories)
      .filter(showCategory)
      .sort(
        (categoryA, categoryB) =>
          categoriesPreferences[categoryA.id].order -
          categoriesPreferences[categoryB.id].order
      );

    return visibleCategoriesSorted.map(category => {
      return (
        <Category
          key={category.id}
          id={category.id}
          scope={scope}
          preferencesFetched={!_.isEmpty(categoriesPreferences)}
        />
      );
    });
  };

  const renderScope = (scope: Scope) => {
    const scopeClass = _.lowerCase(scope);
    let scopeName: string;
    let scopeTooltip: string;
    switch (scope) {
      case Scope.UPSTREAM:
        scopeName = t("footprint.scope.upstream");
        scopeTooltip = "Scope 3";
        break;
      case Scope.CORE:
        scopeName = t("footprint.scope.core");
        scopeTooltip = "Scope 1+2";
        break;
      case Scope.DOWNSTREAM:
        scopeName = t("footprint.scope.downstream");
        scopeTooltip = "Scope 3";
        break;
    }
    return (
      <div className={cx(styles.scopeColumnContainer)}>
        <div className={cx(styles.scopeColumn, styles[scopeClass])}>
          <div className={styles.header}>
            <Tooltip content={scopeTooltip} hideDelay={0} showDelay={0}>
              <p className={styles.scopeName}>
                {scopeName.toLocaleUpperCase()}
              </p>
            </Tooltip>
            <div className={styles.total}>
              <p>
                <ResultDisplayer
                  tco2={entryInfoByScope[scope].tCo2}
                  total={entryInfoTotal.tCo2}
                  unitMode={unitMode}
                  rawUnitLabel="t"
                />
              </p>
            </div>
          </div>
          {renderCategories(scope)}
        </div>
      </div>
    );
  };

  if (_.isEmpty(categoriesPreferences)) {
    return (
      <div className={styles.scopeColumnsContainer}>
        <div className="d-flex ml-5 align-items-center">
          <div className="spinner-border text-secondary mr-3"></div>
          <div>{upperFirst(t("global.data.loadingData"))}...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      {isCartographyFiltered && (
        <EntriesResultRecap entries={filteredEntries} />
      )}
      <div
        className={cx(styles.scopeColumnsContainer, {
          ["mt-0"]: isCartographyFiltered,
        })}
      >
        {_.isEmpty(categoriesPreferences) ? (
          <div className="d-flex ml-5 align-items-center">
            <div className="spinner-border text-secondary mr-3"></div>
            <div>{upperFirst(t("global.data.loadingData"))}...</div>
          </div>
        ) : (
          <>
            {renderScope(Scope.UPSTREAM)}
            {renderScope(Scope.CORE)}
            {renderScope(Scope.DOWNSTREAM)}
          </>
        )}
      </div>
    </>
  );
};

export default Scopes;
