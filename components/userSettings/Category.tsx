import { useSelector } from "react-redux";
import cx from "classnames";
import { RootState } from "@reducers/index";
import { ActivityCategory } from "@reducers/core/categoryReducer";
import { Scope } from "@custom-types/wecount-api/activity";
import { AllActivityInfoByActivityModel } from "@hooks/core/useAllActivityInfoByActivityModel";
import Foldable from "@components/helpers/form/Foldable";
import styles from "@styles/userSettings/category.module.scss";
import ActivityMode from "./ActivityModel";
import { ActivityModelVisibilityInfoByCategory } from "@hooks/core/useActivityModelVisibilityInfoByCategory";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import { VisibleActivityModelIds } from "@hooks/core/useVisibleActivityModelIds";
import { UserPreferencesActivityCategoryResponse } from "@lib/wecount-api/responses/apiResponses";
import { motion } from "framer-motion";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface CustomEventTarget extends EventTarget {
  hasAttribute: (name: string) => boolean;
}

function isCustomEventTarget(target: EventTarget): target is CustomEventTarget {
  return "hasAttribute" in target;
}

interface Props {
  id: number;
  scope: Scope;
  allActivityInfoByActivityModel: AllActivityInfoByActivityModel;
  isOpen: boolean;
  activityModelVisibilitiesByCategory: ActivityModelVisibilityInfoByCategory;
  visibleActivityModels: VisibleActivityModelIds | null;
  onToggle: (categoryId: number) => void;
  onEditDescription: () => void;
}

const Category = ({
  id,
  scope,
  allActivityInfoByActivityModel,
  activityModelVisibilitiesByCategory,
  visibleActivityModels,
  isOpen,
  onToggle,
  onEditDescription,
}: Props) => {
  const category = useSelector<RootState, ActivityCategory>(
    state => state.core.category.categoryList[scope][id]
  );
  const { activityModelTotal = 0, activityModelVisible = 0 } =
    activityModelVisibilitiesByCategory?.[id] ?? {};

  const allVisible = activityModelTotal === activityModelVisible;
  const allHidden = activityModelVisible === 0;

  const preferencesFetched = visibleActivityModels != null;

  function categoryVisibilitiesBadgeText(): string {
    if (allVisible) return upperFirst(t("activity.category.visibility.allVisible"));
    if (allHidden) return upperFirst(t("activity.category.visibility.allHidden"));
    if (activityModelVisible === 1)
      return upperFirst(t("activity.category.visibility.oneActivityModelVisible"));
    return t("activity.category.visibility.severalActivityModelVisible", {activityModelVisible: activityModelVisible});
  }

  const hasHiddenEntries = category.activityModels.some(
    activityModel =>
      !visibleActivityModels?.[activityModel.id] &&
      allActivityInfoByActivityModel[activityModel.id]?.entriesNumber > 0
  );

  const categoryPreference = useSelector<
    RootState,
    UserPreferencesActivityCategoryResponse | null
  >(state => state.userPreference.activityCategories[category.id] ?? null);

  return (
    <div
      className={cx(styles.category, {
        [styles.open]: isOpen,
        [styles.greyedOut]: allHidden,
      })}
    >
      <motion.div
        className={cx(styles.categoryHeader)}
        onTap={e => {
          if (e.target != null && isCustomEventTarget(e.target)) {
            !e.target.hasAttribute("data-cancel-click") && onToggle(id);
          }
        }}
      >
        <div className={styles.dragIcon}>
          <i className={cx("fa fa-ellipsis-v")}></i>
          <i className={cx("fa fa-ellipsis-v")}></i>
        </div>
        <div className={styles.pictoContainer}>
          <img
            className={styles.picto}
            src={`/icons/categories/icon-${category.iconName ?? "energie"}.svg`}
            alt=""
          />
        </div>
        <p className={styles.categoryName}>
          {category.name}
          {categoryPreference != null && (
            <Tooltip
              content={
                categoryPreference.description || upperFirst(t("activity.category.comment.add"))
              }
              hideDelay={0}
            >
              <button
                className={cx(styles.commentButton, {
                  [styles.hasDescription]: categoryPreference.description,
                })}
                data-cancel-click
                onClick={e => {
                  onEditDescription();
                }}
              >
                <img
                  data-cancel-click
                  src="/icons/modale/icon-comment.svg"
                  alt={t("entry.comment.comment.plural")}
                />
              </button>
            </Tooltip>
          )}
        </p>
        {hasHiddenEntries && preferencesFetched && (
          <Tooltip
            content={<div>{upperFirst(t("activity.someAreHidden"))}</div>}
            hideDelay={0}
          >
            <div className={cx("badge", styles.hiddenEntriesBadge)}>
              <i className="fa fa-exclamation-triangle"></i>
            </div>
          </Tooltip>
        )}
        {preferencesFetched ? (
          <Tooltip
            content={<div>{categoryVisibilitiesBadgeText()}</div>}
            hideDelay={0}
          >
            <div
              className={cx(
                "badge badge-secondary",
                { ["badge-success"]: allVisible },
                styles.activityModelVisibilityBadge
              )}
            >
              {allHidden ? (
                <i className="fa fa-eye-slash"></i>
              ) : (
                <i className="fa fa-eye"></i>
              )}
              <span className={styles.count}>
                {activityModelVisible}/{activityModelTotal}
              </span>
            </div>
          </Tooltip>
        ) : (
          <div
            className={cx("spinner-border text-secondary", styles.spinner)}
            role="status"
          ></div>
        )}
        {/* <i
          className={`${styles.foldIcon} fas fa-chevron-${
            isOpen ? "up" : "down"
          }`}
        ></i> */}
      </motion.div>
      <Foldable isOpen={isOpen}>
        <div className={styles.activityModels}>
          {category.activityModels.map(model => {
            // Si l'activité est archivée, et qu'aucune donnée n'est présente, on ne l'affiche pas
            if (!allActivityInfoByActivityModel[model.id]?.entriesNumber && model.archivedDate) {
              return <div key={model.id}></div>;
            }
            
            return <ActivityMode
              key={model.id}
              id={model.id}
              uniqueName={model.uniqueName}
              isPrivate={model.isPrivate}
              isVisible={visibleActivityModels?.[model.id] === true}
              name={model.name}
              scope={scope}
              activityEntries={
                allActivityInfoByActivityModel[model.id]?.entriesNumber ?? 0
              }
              preferencesFetched={preferencesFetched}
            />
            })}
        </div>
      </Foldable>
    </div>
  );
};

export default Category;
