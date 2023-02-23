import { useSelector } from "react-redux";

import { SearchableFilterName } from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";

import selectActivityModelsInCartography from "@selectors/cartography/selectActivityModelsInCartography";
import useCategoryInfo from "@hooks/core/useCategoryInfo";

import SearchableFilter from "./SearchableFilter";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  filterName: SearchableFilterName;
}

const ActivityModelFilter = ({ filterName }: Props) => {
  const activityModels = useSelector((state: RootState) =>
    selectActivityModelsInCartography(state)
  );

  const categories = useCategoryInfo();

  const activityModelsWithCategoryName = activityModels.map(activityModel => ({
    id: activityModel.id,
    name: `${categories[activityModel.categoryId].name} - ${
      activityModel.name
    }`,
  }));

  return (
    <SearchableFilter
      title={t("activity.activities")}
      filterName={filterName}
      ressources={activityModelsWithCategoryName}
    />
  );
};

export default ActivityModelFilter;
