import { useDispatch } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useState } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";

import selectCategoriesInCartographyForCampaign from "@selectors/cartography/selectCategoriesInCartographyForCampaign";
import selectCategoryIdsOfSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectCategoryIdsOfSelectedEntryData";
import { setMappableData } from "@actions/dataImport/entryData/entryDataActions";
import useMultiActionModaleContext from "@components/campaign/data-import/sub/multi-action/hooks/useMultiActionModaleContext";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import BaseModale from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";

const EditAllActivityModale = () => {
  const dispatch = useDispatch();

  const activityModelInfo = useActivityModelInfo();
  const { campaignId } = useMultiActionModaleContext();
  const categoriesInCartography = useSelector((state: RootState) =>
    selectCategoriesInCartographyForCampaign(state, campaignId)
  );
  const selectedCategoryIds = useSelector(selectCategoryIdsOfSelectedEntryData);
  const isSelectionValid =
    selectedCategoryIds.length === 1 && selectedCategoryIds[0] != null;

  const categoryOfSelection = selectedCategoryIds[0] ?? -1;
  const availableActivityModels =
    categoriesInCartography[categoryOfSelection]?.activityModels ?? [];

  const [activityModelId, setActivityModelId] = useState<number | null>(null);

  const previewActivityModel = activityModelInfo[activityModelId ?? -1]?.name;

  return (
    <BaseModale
      renderTitle={count =>
        upperFirst(
          t("dataImport.multiActions.actionTitles.editActivity", { count })
        )
      }
      icon={<i className="far fa-list-alt" />}
      onApplyButtonClick={entryDataIds => {
        if (isSelectionValid && activityModelId != null) {
          dispatch(
            setMappableData({
              entryDataIds,
              dataName: "activityModel",
              id: activityModelId,
              entityName: previewActivityModel ?? ""
            })
          );
        }
      }}
      applyButtonLabel={upperFirst(t("global.modify"))}
      renderControls={
        <SelectOne
          selected={activityModelId}
          onOptionClick={setActivityModelId}
          placeholder={upperFirst(
            t("dataImport.multiActions.actionPlaceholders.chooseActivity")
          )}
        >
          {props => (
            <>
              {availableActivityModels.map(({ id, name }) => (
                <Option {...props} key={id} value={id}>
                  {name}
                </Option>
              ))}
            </>
          )}
        </SelectOne>
      }
      previewValues={{ activityModel: previewActivityModel }}
    />
  );
};

export default EditAllActivityModale;
