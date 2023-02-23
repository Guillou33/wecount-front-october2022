import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import { useDispatch, useSelector } from "react-redux";
import selectEFMappingFiltered from "@selectors/emissionFactorChoice/selectEFMappingFiltered";
import { setModalOpen, updateLastChoice } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import EmissionFactorEmptyList from "./EmissionFactorEmptyList";
import EmissionFactorItem from "./EmissionFactorItem";
import { ComputeMethod, EmissionFactorMapping } from "@reducers/core/emissionFactorReducer";
import useInfiniteScrollPagination from "@hooks/utils/useInfiniteScrollPagination";
import { useRef } from "react";
import { RootState } from "@reducers/index";
import { SearchType } from "@custom-types/wecount-api/searchTypes";

interface Props {}

const EmissionFactorListSection = ({}: Props) => {
  const dispatch = useDispatch();
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
  const isSearchBoxType = !!activityModelId && computeMethod.emissionFactorSearchType === SearchType.searchBox
  const emissionFactorMappings = useSelector(selectEFMappingFiltered(isSearchBoxType));
  const scrollContainerRef = useRef<any>(null);

  const { containerRef, listSize } =
    useInfiniteScrollPagination(emissionFactorMappings, {root: scrollContainerRef});

  const onChoose = (emissionFactorMapping: EmissionFactorMapping) => {
    dispatch(updateLastChoice({
      emissionFactorId: emissionFactorMapping.emissionFactor.id,
    }));
    dispatch(setModalOpen(false));
  }

  return (
    <div className={cx(styles.efListSectionContainer)} ref={scrollContainerRef}>
      {!emissionFactorMappings.length ? (
        <div>
          <EmissionFactorEmptyList />
        </div>
      ) : (
        <div className={cx(styles.efListContainer)}>
          <div ref={containerRef}>
            {emissionFactorMappings.slice(0, listSize + 4).map((efm) => {
              return (
                
                <div key={efm.emissionFactor.id}>
                  <EmissionFactorItem recommended={efm.recommended} onChoose={() => onChoose(efm)} emissionFactor={efm.emissionFactor} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmissionFactorListSection;
