import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import FilterElement from "@components/filters/filterInputs/FilterElement";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";
import filterStyles from "@styles/filters/filterElement.module.scss";
import { RootState } from "@reducers/index";
import { ComputeMethod } from "@reducers/core/emissionFactorReducer";
import { useDispatch, useSelector } from "react-redux";
import { ChildTagLabel } from "@lib/wecount-api/responses/apiResponses";
import { toggleFilterTag } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import useTranslate from "@hooks/core/translation/useTranslate";
import { upperFirst } from "lodash";

const TagFilterGroups = () => {
  const t = useTranslate()
  const dispatch = useDispatch();
  const selectedTagIds = useSelector<RootState, {id: number; name: string}[]>(state => state.emissionFactorChoice.emissionFactorFilters.tags);
  const activityModelId = useSelector<RootState, number>(
    (state) => state.emissionFactorChoice.currentActivityModelId!
  );
  const computeMethodId = useSelector<RootState, number | undefined>(
    (state) => state.emissionFactorChoice.currentComputeMethodId
  );
  const computeMethod = useSelector<
    RootState,
    ComputeMethod
  >((state) => state.core.emissionFactor.mapping[activityModelId][computeMethodId!]);

  const childrenTagLabels = computeMethod.rootTagLabels.reduce<{[id: number]: ChildTagLabel}>((childrenTagLabels, rootTagLabel) => {
    rootTagLabel.childrenTagLabels.forEach(childTagLabel => {
      childrenTagLabels[childTagLabel.id] = childTagLabel;
    });
    return childrenTagLabels;
  }, {});
  return (
    <div className={cx(styles.tagsContainer)}>
      {Object.values(childrenTagLabels).length === 0 && (
        <div className={cx(styles.emptyTags)}>
          <p>{upperFirst(t('emissionFactorChoice.noTagAvailableMessage'))}</p>
        </div>
      )}
      {Object.values(childrenTagLabels).map(childTagLabel => {
        return (
          <FilterElement title={childTagLabel.name}>
            <>
              {childTagLabel.emissionFactorTags.map((tag) => (
                <CheckboxInput
                  id={`${tag.id}`}
                  key={`${tag.id}`}
                  checked={selectedTagIds.find(selectedTagId => selectedTagId.id === tag.id) !== undefined}
                  onChange={() => dispatch(toggleFilterTag({
                    id: tag.id,
                    name: tag.name,
                  }))}
                  className={cx(filterStyles.filter)}
                  labelClassName={cx(filterStyles.label)}
                >
                  {tag.name}
                </CheckboxInput>
              ))}
            </>
          </FilterElement>
        );
      })}
    </div>
  )
};

export default TagFilterGroups;
