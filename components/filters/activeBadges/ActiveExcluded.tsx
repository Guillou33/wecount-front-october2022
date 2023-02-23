import { toggleExcludedPresence } from "@actions/filters/filtersAction";
import { RootState } from "@reducers/index";
import { ExcludedFilter, ExcludedFilterName } from "@reducers/filters/filtersReducer";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import ActiveFilterBadge from "./ActiveFilterBadge";
import { excludedOptions } from "@custom-types/core/ExcludedOptions";

interface Props {
    filterName: ExcludedFilterName;
}

const ActiveExcluded = ({
    filterName
}: Props) => {
    const dispatch = useDispatch();
    const isExcludedChecked = useSelector<RootState, ExcludedFilter>(
        state => state.filters.cartographyExcluded
    );
    const activeExcludedFilter = isExcludedChecked.excludedEntries;

    return (
        <ActiveFilterBadge
            onRemoveClick={() =>
                dispatch(
                    toggleExcludedPresence({
                        filterName,
                        excludedEntries: 0
                    })
                )
            }
        >
            <p style={{ width: "auto", marginBottom: 2 }}>
                {excludedOptions.filter(option => option.value === activeExcludedFilter)[0].label}
            </p>
        </ActiveFilterBadge>
    )
}

export default ActiveExcluded;