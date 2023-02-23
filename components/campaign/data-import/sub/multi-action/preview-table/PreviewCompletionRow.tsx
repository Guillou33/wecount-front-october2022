import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { EntryData } from "@reducers/dataImport/entryDataReducer";
import { EntryDataKey } from "@lib/core/dataImport/columnConfig";
import { PerimeterRole } from "@custom-types/wecount-api/auth";

import { isMappableData } from "@lib/core/dataImport/mappableData";
import { isStandard } from "@lib/core/dataImport/computeMethod";

import selectVisibleColumns from "@selectors/dataImport/selectVisibleColumns";
import selectCategoriesInCartographyForCampaign from "@selectors/cartography/selectCategoriesInCartographyForCampaign";

import useAllSiteList from "@hooks/core/useAllSiteList";
import useAllProductList from "@hooks/core/useAllProductList";
import useAllUsers from "@hooks/core/useAllUsers";
import useAllEntryTags from "@hooks/core/useAllEntryTags";
import useMultiActionModaleContext from "@components/campaign/data-import/sub/multi-action/hooks/useMultiActionModaleContext";

import getDefaultPossibleValue from "./helpers/getDefaultPossibleValue";
import TagsCellPreview from "./TagsCellPreview";
import ComputeMethodCellPreview from "./ComputeMethodCellPreview";
import EmissionFactorCellPreview from "./EmissionFactorCellPreview";
import MappableCellPreview from "./MappableCellPreview";

interface Props {
  entryData: EntryData;
  previewValues: Partial<Record<EntryDataKey, string>>;
}

const PreviewCompletionRow = ({ entryData, previewValues }: Props) => {
  const { campaignId } = useMultiActionModaleContext();
  const columns = useSelector(selectVisibleColumns);

  const categoriesInCartography = useSelector((state: RootState) =>
    selectCategoriesInCartographyForCampaign(state, campaignId)
  );
  const allSite = useAllSiteList({ includeSubSites: true });
  const allProducts = useAllProductList();

  const users = useAllUsers();
  const allOwners = users.reduce((acc, user) => {
    acc[user.id] = { name: user.email };
    return acc;
  }, getDefaultPossibleValue());

  const allWriters = users.reduce((acc, user) => {
    if (
      user.roleWithinPerimeter !== PerimeterRole.PERIMETER_CONTRIBUTOR &&
      user.roleWithinPerimeter !== PerimeterRole.PERIMETER_COLLABORATOR
    ) {
      acc[user.id] = { name: user.email };
    }
    return acc;
  }, getDefaultPossibleValue());

  const activityModelsInCategory =
    categoriesInCartography[entryData.activityCategory.value ?? -1]
      ?.activityModels ?? [];

  const activityModels = activityModelsInCategory.reduce(
    (acc, activityModel) => {
      acc[activityModel.id] = { name: activityModel.name };
      return acc;
    },
    getDefaultPossibleValue()
  );

  const tags = useAllEntryTags();
  const availableTags = tags.reduce((acc, tag) => {
    acc[tag.id] = { name: tag.name };
    return acc;
  }, {} as Record<number, { name: string }>);

  const possibleValues = {
    site: allSite,
    product: allProducts,
    owner: allOwners,
    writer: allWriters,
    activityCategory: categoriesInCartography,
    activityModel: activityModels,
  };

  return (
    <>
      {columns.map(column => {
        const entryDataKey = column.entryDataKey;

        if (entryDataKey === "tags") {
          return (
            <TagsCellPreview
              data={entryData.tags}
              possibleValues={availableTags}
              preview={previewValues.tags}
            />
          );
        }

        if (entryDataKey === "computeMethod") {
          return (
            <ComputeMethodCellPreview
              key={entryDataKey}
              computeMethod={entryData.computeMethod}
              activityModelId={entryData.activityModel.value}
              preview={previewValues.computeMethod}
            />
          );
        }
        if (entryDataKey === "emissionFactor") {
          const computeMethod = entryData.computeMethod;
          if (computeMethod != null && isStandard(computeMethod))
            return (
              <EmissionFactorCellPreview
                key={entryDataKey}
                computeMethod={computeMethod}
                activityModelId={entryData.activityModel.value}
                emissionFactorId={entryData.emissionFactor?.id ?? null}
                preview={previewValues.emissionFactor}
              />
            );
        }

        if (isMappableData(entryDataKey)) {
          return (
            <MappableCellPreview
              preview={previewValues[entryDataKey]}
              data={entryData[entryDataKey]}
              possibleValues={possibleValues[entryDataKey]}
            />
          );
        }

        return (
          <td key={entryDataKey}>
            {previewValues[entryDataKey] ?? entryData[entryDataKey]}
          </td>
        );
      })}
    </>
  );
};

export default PreviewCompletionRow;
