import { useSelector } from "react-redux";

import { SearchableFilterName } from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";

import selectEmissionFactorsUsedByCampaign from "@selectors/emissionFactor/selectEmissionFactorsUsedByCampaign";

import SearchableFilter from "./SearchableFilter";
import { t } from "i18next";

interface Props {
  filterName: SearchableFilterName;
  campaignId: number;
}

const EmissionFactorsFilter = ({ filterName, campaignId }: Props) => {
  const emissionFactors = useSelector((state: RootState) =>
    selectEmissionFactorsUsedByCampaign(state, campaignId)
  );

  return (
    <SearchableFilter
      title={t("footprint.emission.emissionFactor.emissionFactor")}
      filterName={filterName}
      ressources={Object.values(emissionFactors)}
    />
  );
};

export default EmissionFactorsFilter;
