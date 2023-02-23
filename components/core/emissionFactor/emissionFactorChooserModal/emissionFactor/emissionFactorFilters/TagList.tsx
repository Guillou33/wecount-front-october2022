import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import ActiveFilterBadge from "@components/filters/activeBadges/ActiveFilterBadge";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { toggleFilterTag } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import { upperFirst } from "lodash";

const TagList = () => {
  const dispatch = useDispatch();
  const selectedTagIds = useSelector<RootState, {id: number; name: string}[]>(state => state.emissionFactorChoice.emissionFactorFilters.tags);
  return (
    <div className={cx(styles.activeTagsContainer)}>
      {selectedTagIds.map((tag) => {
        return (
          <ActiveFilterBadge
            key={`${tag.id}`}
            onRemoveClick={() => dispatch(toggleFilterTag({
              id: tag.id,
            }))}
            className={styles.activeTag}
          >
            {upperFirst(tag.name)}
          </ActiveFilterBadge>
        );
      })}
    </div>
  );
};

export default TagList;
