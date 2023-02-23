import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import useTranslate from "@hooks/core/translation/useTranslate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import { updateFilterEfText } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import { ComputeMethod } from "@reducers/core/emissionFactorReducer";
import { SearchType } from "@custom-types/wecount-api/searchTypes";
import { autocompleteEmissionFactors } from "@actions/core/emissionFactor/emissionFactorActions";
import { upperFirst } from "lodash";

const EmissionFactorSearchInput = () => {
  const t = useTranslate();
  const dispatch = useDispatch();
  const searchText = useSelector<RootState, string>(state => state.emissionFactorChoice.emissionFactorFilters.text);
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
  const hasNotEnoughCharacters = useSelector<RootState, boolean>(state => state.emissionFactorChoice.efSearchMissesCharacters);

  const onTextChange = (value: string) => {
    dispatch(updateFilterEfText(value));
    if (activityModelId && computeMethod.emissionFactorSearchType === SearchType.searchBox) {
      dispatch(
        autocompleteEmissionFactors({
          activityModelId: activityModelId,
          computeMethodId: computeMethod.id,
          searchText: value,
        })
      );
    }
  }

  return (
    <div className="default-field">
      <SelfControlledInput
        className={cx("field", styles.field)}
        value={searchText}
        onLocalChange={onTextChange}
        rightIconClassName={cx("fa fa-search", styles.searchIcon)}
        placeholder={`${upperFirst(t("global.search"))}...`}
      />
      {hasNotEnoughCharacters && (
        <div className={styles.errorEfField}>
          <p>
            {upperFirst(t("emissionFactorChoice.notEnoughCharacters"))}
          </p>
        </div>
      )}
    </div>
  );
};

export default EmissionFactorSearchInput;
