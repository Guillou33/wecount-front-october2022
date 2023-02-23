import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";

import selectAllCategoriesByName from "@selectors/category/selectAllCategoriesByName";
import selectAllSitesByName from "@selectors/sites/selectAllSitesByName";
import selectAllProductsByName from "@selectors/products/selectAllProductsByName";
import selectAllUsersByName from "@selectors/users/selectAllUsersByName";
import selectAllManagersByName from "@selectors/users/selectAllManagersByName";
import selectAllEntryTagsByName from "@selectors/entryTags/selectAllEntryTagsByName";

import { buildDataMapper } from "@lib/core/dataImport/rawDataToEntryData";

function useDataMapper(campaignId: number) {
  const categories = useSelector((state: RootState) =>
    selectAllCategoriesByName(state, campaignId)
  );
  const sites = useSelector(selectAllSitesByName);
  const products = useSelector(selectAllProductsByName);
  const users = useSelector(selectAllUsersByName);
  const managers = useSelector(selectAllManagersByName);
  const tags = useSelector(selectAllEntryTagsByName);

  return buildDataMapper({
    categories,
    sites,
    products,
    users,
    managers,
    tags,
  });
}

export default useDataMapper;
