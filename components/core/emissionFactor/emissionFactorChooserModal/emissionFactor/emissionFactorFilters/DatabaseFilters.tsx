import cx from "classnames";
import styles from "@styles/core/emissionFactor/emissionFactorChooserModal/emissionFactorChooserModal.module.scss";
import EFMainFilter from "./EFMainFilter";
import useTranslate from "@hooks/core/translation/useTranslate";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@reducers/index";
import { toggleFilterDb } from "@actions/emissionFactorChoice/emissionFactorChoiceActions";
import { upperFirst } from "lodash";

interface Props {}

const DatabaseFilters = () => {
  const t = useTranslate();
  const dispatch = useDispatch();

  const dbFilters = useSelector<
    RootState,
    { ademe: boolean; ghg: boolean; wecount: boolean; other: boolean; }
  >((state) => state.emissionFactorChoice.emissionFactorFilters.db);

  const databases = ["ademe", "ghg", "wecount", "other"] as (
    | "ademe"
    | "ghg"
    | "wecount"
    | "other"
  )[];

  const renderedDatabaseFilters = databases.map((databaseName) => {
    return (
      <EFMainFilter
        onChange={() => {
          dispatch(toggleFilterDb(databaseName));
        }}
        active={dbFilters[databaseName]}
        text={t(`footprint.${databaseName}`)}
        key={databaseName}
      />
    );
  });
  return (
    <div className={cx(styles.databaseFiltersContainer)}>
      {renderedDatabaseFilters}
    </div>
  );
};

export default DatabaseFilters;
