import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { EntryData } from "@reducers/dataImport/entryDataReducer";
import { PreviewValues } from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";

import { isMappableData } from "@lib/core/dataImport/mappableData";

import selectCartographyAssociationColumns from "@selectors/dataImport/selectCartographyAssociationColumns";
import selectCategoriesInCartographyForCampaign from "@selectors/cartography/selectCategoriesInCartographyForCampaign";

import useMultiActionModaleContext from "@components/campaign/data-import/sub/multi-action/hooks/useMultiActionModaleContext";

import getDefaultPossibleValue from "@components/campaign/data-import/sub/multi-action/preview-table/helpers/getDefaultPossibleValue";
import MappableCellPreview from "@components/campaign/data-import/sub/multi-action/preview-table/MappableCellPreview";

interface Props {
  entryData: EntryData;
  previewValues: PreviewValues;
}

const PreviewCartographyAssociationRow = ({
  entryData,
  previewValues,
}: Props) => {
  const { campaignId } = useMultiActionModaleContext();
  const columns = useSelector(selectCartographyAssociationColumns);

  const categoriesInCartography = useSelector((state: RootState) =>
    selectCategoriesInCartographyForCampaign(state, campaignId)
  );

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

  const possibleValues = {
    activityCategory: categoriesInCartography,
    activityModel: activityModels,
  };

  return (
    <>
      {columns.map(column => {
        const entryDataKey = column.entryDataKey;

        if (
          entryDataKey === "activityCategory" ||
          entryDataKey === "activityModel"
        ) {
          return (
            <MappableCellPreview
              key={entryDataKey}
              preview={previewValues[entryDataKey]}
              data={entryData[entryDataKey]}
              possibleValues={possibleValues[entryDataKey]}
            />
          );
        }

        return (
          <td key={entryDataKey}>
            {isMappableData(entryDataKey)
              ? entryData[entryDataKey].triedInput
              : entryData[entryDataKey]}
          </td>
        );
      })}
    </>
  );
};

export default PreviewCartographyAssociationRow;
