import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import useTranslate from "@hooks/core/translation/useTranslate";
import { upperFirst } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import Spinner from "@components/helpers/ui/Spinner";

const EmissionFactorEmptyList = () => {
  const t = useTranslate();
  const searchText = useSelector<RootState, string>(state => state.emissionFactorChoice.emissionFactorFilters.text);
  const isSearchingEF = useSelector<RootState, boolean>(state => state.emissionFactorChoice.isSearchingEF);
  return (
    <div className={cx(styles.emptyEFListContainer)}>
      <p>
        {
          isSearchingEF ? 
            (<Spinner />) : 
            upperFirst(t(searchText ? 'emissionFactorChoice.noEfAvailableMessage': 'emissionFactorChoice.searchEf'))
        }
      </p>
    </div>
  );
};

export default EmissionFactorEmptyList;
