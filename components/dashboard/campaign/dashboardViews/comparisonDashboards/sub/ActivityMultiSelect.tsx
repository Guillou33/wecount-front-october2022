import { useSelector } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import cx from "classnames";
import { useRef, useState } from "react";
import throttle from "lodash/throttle";

import { RootState } from "@reducers/index";

import selectCategoriesInCartographyForCampaign from "@selectors/cartography/selectCategoriesInCartographyForCampaign";
import selectActivityModelsInCartographyForCampaign from "@selectors/cartography/selectActivityModelsInCartographyForCampaign";

import { MultiSelect, CheckboxOption } from "@components/helpers/ui/selects";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";

import styles from "@styles/dashboard/campaign/dashboardViews/comparisonDashboards/sub/activityMultiSelect.module.scss";

interface Props {
  campaignId: number;
  selectedActivityModels: number[];
  onChange: (selectedActivityModels: number[]) => void;
}

const ActivityMultiSelect = ({
  campaignId,
  selectedActivityModels,
  onChange,
}: Props) => {
  const categories = useSelector((state: RootState) =>
    selectCategoriesInCartographyForCampaign(state, campaignId)
  );
  const activityModels = useSelector((state: RootState) =>
    selectActivityModelsInCartographyForCampaign(state, campaignId)
  );
  const allActivityModelIds = activityModels.map(am => am.id);

  const [isFixed, setIsFixed] = useState(false);

  const optionContainer = useRef<HTMLElement | null>(null);

  const handleScroll = throttle(() => {
    if (optionContainer.current != null) {
      setIsFixed(optionContainer.current.scrollTop !== 0);
    }
  }, 16);

  const controlSelectionButtonsWrapperRef = (ref: HTMLDivElement) => {
    if (ref != null) {
      optionContainer.current = ref.parentElement;
      optionContainer.current?.addEventListener("scroll", handleScroll);
    } else {
      optionContainer.current?.removeEventListener("scroll", handleScroll);
    }
  };

  const selectedActivityModelsRecord = selectedActivityModels.reduce(
    (acc, activityModelId) => {
      acc[activityModelId] = true;
      return acc;
    },
    {} as Record<number, true>
  );

  return (
    <div className={styles.activityMultiSelectContainer}>
      {upperFirst(t("activity.activities"))}
      <MultiSelect
        selected={selectedActivityModels}
        onOptionClick={activityModelId => {
          const newSelectedActivityModels = selectedActivityModels.includes(
            activityModelId
          )
            ? selectedActivityModels.filter(id => id !== activityModelId)
            : [...selectedActivityModels, activityModelId];
          onChange(newSelectedActivityModels);
        }}
        className={styles.multiSelect}
        optionContainerClassName={styles.optionContainer}
        alignment="right"
      >
        {ctx => (
          <>
            <div
              className={cx(styles.controlSelectionButtonsWrapper, {
                [styles.shadowed]: isFixed,
              })}
              ref={controlSelectionButtonsWrapperRef}
            >
              <button
                className={cx("button-2 small", styles.controlSelectionButton)}
                onClick={() => onChange(allActivityModelIds)}
              >
                {upperFirst(
                  t(
                    "dashboard.activityComparisonChart.activityModelMultiSelect.selectAll"
                  )
                )}
              </button>
              <button
                className={cx("button-2 small", styles.controlSelectionButton)}
                onClick={() => onChange([])}
              >
                {upperFirst(
                  t(
                    "dashboard.activityComparisonChart.activityModelMultiSelect.unselectAll"
                  )
                )}
              </button>
            </div>
            {Object.values(categories).flatMap(category => {
              const allActivityModelsSelected = category.activityModels.every(
                activityModel => selectedActivityModelsRecord[activityModel.id]
              );
              const noActivityModelsSelected = category.activityModels.every(
                activityModel =>
                  selectedActivityModelsRecord[activityModel.id] == undefined
              );
              const partiallySelected =
                !allActivityModelsSelected && !noActivityModelsSelected;
              return [
                <CheckboxInput
                  id={`checkbox-category-${category.id}`}
                  key={category.id}
                  className={cx(styles.optionGroup, {
                    [styles.selected]: allActivityModelsSelected,
                    [styles.partiallySelected]: partiallySelected,
                  })}
                  labelClassName={styles.optionGroupLabel}
                  checked={allActivityModelsSelected}
                  partiallyChecked={partiallySelected}
                  onChange={checked => {
                    const newSelectionRecord = {
                      ...selectedActivityModelsRecord,
                    };
                    category.activityModels.forEach(activityModel => {
                      if (checked) {
                        newSelectionRecord[activityModel.id] = true;
                      } else {
                        delete newSelectionRecord[activityModel.id];
                      }
                    });

                    onChange(
                      Object.keys(newSelectionRecord).map(key => Number(key))
                    );
                  }}
                >
                  {category.name}
                </CheckboxInput>,
                category.activityModels.map(activityModel => (
                  <CheckboxOption
                    {...ctx}
                    value={activityModel.id}
                    key={activityModel.id}
                    className={styles.option}
                    isSelected={
                      selectedActivityModelsRecord[activityModel.id] !==
                      undefined
                    }
                  >
                    {activityModel.name}
                  </CheckboxOption>
                )),
              ];
            })}
          </>
        )}
      </MultiSelect>
    </div>
  );
};

export default ActivityMultiSelect;
