import { createSelector } from "reselect";

import { RootState } from "@reducers/index";

import { EmissionFactorMapping } from "@reducers/core/emissionFactorReducer";
import selectEFMappingFullList from "./selectEFMappingFullList";
import { EmissionFactorFilters } from "@reducers/emissionFactorChoice/emissionFactorChoiceReducer";
import { DbName } from "@custom-types/wecount-api/emissionFactor";

const selectEFMappingFiltered = (searchBoxType: boolean = true) => createSelector([
  selectEFMappingFullList,
  (state: RootState) => state.emissionFactorChoice.emissionFactorFilters,
], (efms, filters) => {
  
  efms = filterByDB(efms, filters);
  efms = filterByRecommended(efms, filters);
  efms = filterByTags(efms, filters);
  // Only filter in front if no filter in back to wait for
  !searchBoxType && (efms = filterByText(efms, filters));
  
  return efms;
});

const filterByDB = (efms: EmissionFactorMapping[], filters: EmissionFactorFilters) => {
  if (!filters.db.ademe && !filters.db.wecount && !filters.db.ghg && !filters.db.other) {
    return efms;
  }

  return efms.filter(efm => {
    return efm.emissionFactor.dbName == DbName.ADEME && filters.db.ademe || efm.emissionFactor.dbName == DbName.GHG && filters.db.ghg || efm.emissionFactor.dbName == DbName.WECOUNT && filters.db.wecount || ![DbName.GHG, DbName.ADEME, DbName.WECOUNT].includes(efm.emissionFactor.dbName) && filters.db.other;
  });
}

const filterByRecommended = (efms: EmissionFactorMapping[], filters: EmissionFactorFilters) => {
  if (filters.recommended) {
    efms = efms.filter(efm => {
      const isEfDisabled = efm.emissionFactor.notVisible || efm.emissionFactor.archived;
      return !isEfDisabled && efm.recommended
    });
  }

  return efms;
}

const filterByTags = (efms: EmissionFactorMapping[], filters: EmissionFactorFilters) => {
  if (filters.tags.length === 0) {
    return efms;
  }

  efms = efms.filter(efm => {
    const efTagIds = efm.emissionFactor.tagIds;
    if (!efTagIds) {
      return false;
    }

    return filters.tags.map(tag => tag.id).every(tagId => efTagIds.some(efTagId => efTagId === tagId));
  });

  return efms;
}

const filterByText = (efms: EmissionFactorMapping[], filters: EmissionFactorFilters) => {
  if (!filters.text) {
    return efms;
  }

  efms = efms.filter(efm => {
    const efName = efm.emissionFactor.name;

    return efName.toLowerCase().includes(filters.text.toLowerCase());
  });

  return efms;
}

export default selectEFMappingFiltered;
