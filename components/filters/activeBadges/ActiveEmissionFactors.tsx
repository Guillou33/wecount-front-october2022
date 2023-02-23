import { useDispatch, useSelector } from "react-redux";

import selectEmissionFactorsUsedByCampaign from "@selectors/emissionFactor/selectEmissionFactorsUsedByCampaign";
import {
  SearchableFilterName,
  PresenceHashMap,
} from "@reducers/filters/filtersReducer";
import { RootState } from "@reducers/index";
import { EmissionFactor } from "@reducers/campaignReducer";

import ActiveFilterBadge from "./ActiveFilterBadge";

import { toggleSearchableFilterPresence } from "@actions/filters/filtersAction";

interface Props {
  filterName: SearchableFilterName;
  campaignId: number;
}

const ActiveEmissionFactors = ({ filterName, campaignId }: Props) => {
  const dispatch = useDispatch();

  const emissionFactors = useSelector<
    RootState,
    Record<number, EmissionFactor> | null
  >(state => selectEmissionFactorsUsedByCampaign(state, campaignId));

  const selectedEmissionFactors = useSelector<
    RootState,
    PresenceHashMap<number>
  >(state => state.filters[filterName].elementIds);
  return (
    <>
      {Object.keys(selectedEmissionFactors).map(emissionFactorId => (
        <ActiveFilterBadge
          key={emissionFactorId}
          onRemoveClick={() =>
            dispatch(
              toggleSearchableFilterPresence({
                filterName,
                elementId: Number(emissionFactorId),
              })
            )
          }
        >
          <>
            <img
              src="/icons/modale/icon-emission-gef.svg"
              alt=""
              className="mr-1 mb-1"
            />
            {emissionFactors?.[Number(emissionFactorId)]?.name}
          </>
        </ActiveFilterBadge>
      ))}
    </>
  );
};

export default ActiveEmissionFactors;
