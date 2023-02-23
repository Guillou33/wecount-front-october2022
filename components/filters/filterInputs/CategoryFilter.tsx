import { useSelector } from "react-redux";

import { SearchableFilterName } from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";

import selectCategoriesInCartography from "@selectors/cartography/selectCategoriesInCartography";

import SearchableFilter from "./SearchableFilter";
import { t } from "i18next";

interface Props {
  filterName: SearchableFilterName;
}

const ActivityModelFilter = ({ filterName }: Props) => {
  const categories = useSelector((state: RootState) =>
    selectCategoriesInCartography(state)
  );

  return (
    <SearchableFilter
      title={t("activity.category.categories")}
      filterName={filterName}
      ressources={Object.values(categories)}
    />
  );
};

export default ActivityModelFilter;
