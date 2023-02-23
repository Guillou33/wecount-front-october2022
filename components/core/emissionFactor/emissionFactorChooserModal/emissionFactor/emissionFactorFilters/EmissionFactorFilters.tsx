import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import useTranslate from "@hooks/core/translation/useTranslate";
import DatabaseFilters from "./DatabaseFilters";
import EFMainFilter from "./EFMainFilter";
import FilterButton from "@components/filters/FilterButton";
import { useDispatch, useSelector } from "react-redux";
import { setTagColumnOpen, toggleFilterRecommended } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import { RootState } from "@reducers/index";
import TagList from "./TagList";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import EmissionFactorSearchInput from "./EmissionFactorSearchInput";
import { upperFirst } from "lodash";

const EmissionFactorFilters = () => {
  const t = useTranslate();
  const dispatch = useDispatch();
  const selectedTagIds = useSelector<RootState, {id: number; name: string}[]>(state => state.emissionFactorChoice.emissionFactorFilters.tags);
  const tagColumnOpen = useSelector(
    (state: RootState) => state.emissionFactorChoice.tagColumnOpen
  );
  const recommendedFilter = useSelector<
    RootState,
    boolean
  >((state) => state.emissionFactorChoice.emissionFactorFilters.recommended);

  return (
    <div className={cx(styles.efFiltersContainer)}>
      <div className={cx(styles.seachContainer)}>
        <EmissionFactorSearchInput />
      </div>
      <div className={cx(styles.filtersContainer)}>
        <div className={cx(styles.leftSideFilters)}>
          <DatabaseFilters />
        </div>
        <EFMainFilter onChange={() => {
          dispatch(toggleFilterRecommended());
        }} active={recommendedFilter} text={upperFirst(t("global.recommended"))} />
      </div>
      <div className={cx(styles.tagFiltersContainer)}>
        <div className={cx(styles.filterButtonContainer)}>
          <FilterButton
            filterNumber={selectedTagIds.length}
            onClick={() => dispatch(setTagColumnOpen(!tagColumnOpen))}
          />
        </div>
        <TagList />
      </div>
    </div>
  );
};

export default EmissionFactorFilters;
