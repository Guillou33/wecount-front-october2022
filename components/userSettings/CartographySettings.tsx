import Tooltip from "@components/helpers/bootstrap/Tooltip";
import DescriptionModale from "@components/userSettings/DescriptionModale";
import SiteProductLayout from "@components/userSettings/resource-crud/common/SiteProductLayout";
import useSetOnceActivityCategoriesPreferences from "@hooks/core/reduxSetOnce/useSetOnceActivityCategoriesPreferences";
import useSetOnceActivityModelPreference from "@hooks/core/reduxSetOnce/useSetOnceActivityModelVisibilities";
import useActivitymodelVisibilityInfoByCategory from "@hooks/core/useActivityModelVisibilityInfoByCategory";
import useAllActivitiesNumberByActivityModel from "@hooks/core/useAllActivityInfoByActivityModel";
import useCurrentPerimeter from "@hooks/core/useCurrentPerimeter";
import useVisibleActivityModelIds from "@hooks/core/useVisibleActivityModelIds";
import getScopeName from "@lib/utils/getScopeName";
import { ActivityCategory, CategoryList } from "@reducers/core/categoryReducer";
import { RootState } from "@reducers/index";
import { ActivityCategoryPreferencesState } from "@reducers/userPreference/activityCategoriesReducer";
import styles from "@styles/userSettings/cartographySettings.module.scss";
import cx from "classnames";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Category from "./Category";

import {
  saveOrders, updateOrders
} from "@actions/userPreference/activityCategories/activityCategoriesAction";
import DragToReorder from "@components/helpers/DragToReorder";

import { t } from "i18next";
import { isEmpty, upperFirst } from "lodash";

type Categories = {
  [key: number]: ActivityCategory;
};

type VisibleCategories = {
  [key: number]: boolean;
};

const CartographySettings = () => {
  const dispatch = useDispatch();
  const currentPerimeter = useCurrentPerimeter();

  useSetOnceActivityModelPreference();
  useSetOnceActivityCategoriesPreferences();

  const categoryList = useSelector<RootState, CategoryList>(
    state => state.core.category.categoryList
  );
  const [openedCategories, setOpenedCategories] = useState<VisibleCategories>(
    {}
  );

  const toggleCategory = (categoryId: number) => {
    setOpenedCategories(state => {
      const stateCopy = { ...state };
      const isCategoryOpened = state[categoryId] === true;
      if (isCategoryOpened) {
        delete stateCopy[categoryId];
      } else {
        stateCopy[categoryId] = true;
      }
      return stateCopy;
    });
  };
  const foldAll = () => {
    setOpenedCategories({});
    lastClickedExpansion.current = "fold";
  };
  const expandAll = () => {
    const allCategoriesVisible = Object.values(categoryList).flatMap(
      categories =>
        Object.keys(categories).map(categoryId => [Number(categoryId), true])
    );
    setOpenedCategories(Object.fromEntries(allCategoriesVisible));
    lastClickedExpansion.current = "expand";
  };

  const allActivitiesNumber = useAllActivitiesNumberByActivityModel();
  const activityModelVisibilitiesInfo =
    useActivitymodelVisibilityInfoByCategory(allActivitiesNumber);
  const visibleActivityModelIds = useVisibleActivityModelIds();

  const [editActivityCategoryId, setEditActivityCategoryId] = useState<
    number | null
  >(null);

  const categoriesPreferences = useSelector<
    RootState,
    ActivityCategoryPreferencesState
  >(state => state.userPreference.activityCategories);

  const lastClickedExpansion = useRef<"fold" | "expand">("fold");

  const orderChangeHandlerMaker =
    (action: typeof saveOrders | typeof updateOrders) =>
    (newOrder: ActivityCategory[]) => {
      if (currentPerimeter != null) {
        dispatch(
          action({
            perimeterId: currentPerimeter.id,
            categorySettings: newOrder.map((item, i) => ({
              activityCategoryId: item.id,
              order: i,
            })),
          })
        );
      }
    };

  return (
    <SiteProductLayout>
      <p className={cx("alert alert-primary", styles.helpMessage)}>
        {upperFirst(t("help.helpMessage.part1"))}{" "}
        <b>{t("help.helpMessage.part2")}</b> {t("help.helpMessage.part3")}{" "}
        <b>{t("help.helpMessage.part4")}</b>.{" "}
        {upperFirst(t("help.helpMessage.part5"))}{" "}
        <b>{t("help.helpMessage.part6")}</b> {t("help.helpMessage.part7")}
        <b>{t("help.helpMessage.part8")}</b>
        {t("help.helpMessage.part9")}.
      </p>
      <div className={styles.toolBar}>
        <div className={styles.expandFoldButtonsContainer}>
          <Tooltip
            content={upperFirst(t("activity.expansion.foldAll"))}
            hideDelay={0}
          >
            <button
              onClick={foldAll}
              className={cx(styles.foldButton, {
                [styles.active]: lastClickedExpansion.current === "fold",
              })}
            ></button>
          </Tooltip>
          <Tooltip
            content={upperFirst(t("activity.expansion.expandAll"))}
            hideDelay={0}
          >
            <button
              onClick={expandAll}
              className={cx(styles.expandButton, {
                [styles.active]: lastClickedExpansion.current === "expand",
              })}
            ></button>
          </Tooltip>
        </div>
      </div>
      {isEmpty(categoriesPreferences) ? (
        <div className="d-flex mt-5 ml-5 align-items-center">
          <div className="spinner-border text-secondary mr-3"></div>
          <div>{upperFirst(t("global.data.loadingData"))}...</div>
        </div>
      ) : (
        <div className={styles.categoryContainer}>
          {Object.entries(categoryList).map(
            ([scope, categories]: [string, Categories]) => {
              const sortedCategories = Object.values(categories).sort(
                (categoryA, categoryB) => {
                  return (
                    categoriesPreferences[categoryA.id].order -
                    categoriesPreferences[categoryB.id].order
                  );
                }
              );
              return (
                <div
                  key={scope}
                  className={cx(styles.scopedCategoryList, styles[scope])}
                >
                  <div className={styles.header}>
                    <p className={styles.scopeName}>
                      {getScopeName(scope).toUpperCase()}
                    </p>
                    <i className={cx("fa fa-eye", styles.headerIcon)}></i>
                  </div>
                  <DragToReorder
                    itemsData={sortedCategories}
                    keyProducer={category => category.id.toString()}
                    onOrderChange={orderChangeHandlerMaker(updateOrders)}
                    onReorderFinished={orderChangeHandlerMaker(saveOrders)}
                    renderItem={category => (
                      <Category
                        key={category.id}
                        id={category.id}
                        scope={category.scope}
                        allActivityInfoByActivityModel={allActivitiesNumber}
                        isOpen={openedCategories[category.id] === true}
                        activityModelVisibilitiesByCategory={
                          activityModelVisibilitiesInfo ?? {}
                        }
                        visibleActivityModels={visibleActivityModelIds}
                        onToggle={toggleCategory}
                        onEditDescription={() =>
                          setEditActivityCategoryId(category.id)
                        }
                      />
                    )}
                  />
                </div>
              );
            }
          )}
        </div>
      )}
      <DescriptionModale
        activityCategoryId={editActivityCategoryId}
        onClose={() => setEditActivityCategoryId(null)}
      />
    </SiteProductLayout>
  );
};

export default CartographySettings;
