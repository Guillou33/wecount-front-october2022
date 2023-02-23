import { useState } from "react";

function useSort<SortFields extends number, RowType>(initialSortField: SortFields, sortMethods: {
  [sortField in SortFields]: (a: RowType, b: RowType) => number
}) {
  const [sortField, setSortField] = useState<SortFields>(initialSortField);
  const [sortDirAsc, setSortDirAsc] = useState<boolean>(true);

  const updateSort = (newSortField: SortFields) => {
    if (sortField === newSortField) {
      setSortDirAsc(!sortDirAsc);
    } else {
      setSortField(newSortField);
      setSortDirAsc(true);
    }
  }

  const sortValues = (values: any[]) => {
    // const valuesCopied = [...values];
    values.sort((a, b) => {
      const sortResult = sortMethods[sortField](a, b);
      return sortDirAsc ? sortResult : (0 - sortResult);
    });
  }

  return { sortField, sortDirAsc, updateSort, sortValues };
}

export { useSort }
