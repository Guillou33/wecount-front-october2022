import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { t } from "i18next";
import { upperFirst } from "lodash";
import cx from "classnames";

import { RootState } from "@reducers/index";
import { EntryData } from "@reducers/dataImport/entryDataReducer";
import selectCartographyAssociationColumnsPaginated from "@selectors/dataImport/selectCartographyAssociationColumnsPaginated";
import selectCategoriesInCartographyForCampaign from "@selectors/cartography/selectCategoriesInCartographyForCampaign";

import areEntryDataEquals from "@lib/core/dataImport/areEntryDataEqual";
import { isMappableData } from "@lib/core/dataImport/mappableData";
import { getErrorsForCartographyAssociation } from "@lib/core/dataImport/getEntryDataError";
import { toggleEntryData } from "@actions/dataImport/entryDataSelection/entryDataSelectionActions";

import { setMappableData } from "@actions/dataImport/entryData/entryDataActions";
import MappableCell from "./MappableCell";
import RowFeedback from "./RowFeedback";
import Checkbox from "@components/helpers/ui/Checkbox";

import styles from "@styles/campaign/data-import/sub/steps/sub/cartographyAssociationRow.module.scss";

interface Props {
  campaignId: number;
  entryData: EntryData;
  isSelected: boolean;
}

const CartographyAssociationRow = memo(
  ({ entryData, campaignId, isSelected }: Props) => {
    const dispatch = useDispatch();

    const columns = useSelector(selectCartographyAssociationColumnsPaginated);

    const categoriesInCartography = useSelector((state: RootState) =>
      selectCategoriesInCartographyForCampaign(state, campaignId)
    );
    const possibleCategories = Object.values(categoriesInCartography).map(
      category => ({
        id: category.id,
        label: category.name,
      })
    );

    const activityModelsInCategory =
      categoriesInCartography[entryData.activityCategory.value ?? -1]
        ?.activityModels ?? [];
    const possibleActivityModels = activityModelsInCategory.map(
      activityModel => ({
        id: activityModel.id,
        label: activityModel.name,
      })
    );

    const errors = getErrorsForCartographyAssociation(entryData);
    const hasError = errors.length > 0;

    return (
      <div className={cx(styles.row, { [styles.hasError]: hasError })}>
        <td>
          <Checkbox
            id={`checkbox-${entryData.id}`}
            checked={isSelected}
            className={styles.checkbox}
            onChange={() =>
              dispatch(toggleEntryData({ entryDataId: entryData.id }))
            }
          />
        </td>
        {columns.map(column => {
          const entryDataKey = column.entryDataKey;
          if (entryDataKey === "activityCategory") {
            return (
              <MappableCell
                key={entryDataKey}
                data={entryData.activityCategory}
                possibleValues={possibleCategories}
                onChange={(id, entityName) =>
                  dispatch(
                    setMappableData({
                      dataName: "activityCategory",
                      entryDataIds: [entryData.id],
                      id,
                      entityName,
                    })
                  )
                }
              />
            );
          }
          if (entryDataKey === "activityModel") {
            return (
              <MappableCell
                key={entryDataKey}
                data={entryData.activityModel}
                possibleValues={possibleActivityModels}
                onChange={(id, entityName) =>
                  dispatch(
                    setMappableData({
                      dataName: "activityModel",
                      entryDataIds: [entryData.id],
                      id,
                      entityName,
                    })
                  )
                }
                disabledMessage={upperFirst(
                  t("dataImport.userFeedback.selectCategoryFirst")
                )}
              />
            );
          }
          if (isMappableData(entryDataKey)) {
            return (
              <td key={entryDataKey}>{entryData[entryDataKey].triedInput}</td>
            );
          }
          return <td key={entryDataKey}>{entryData[entryDataKey]}</td>;
        })}
        <td>
          <RowFeedback errorsOnColumns={errors} />
        </td>
      </div>
    );
  },
  (propsA, propsB) =>
    areEntryDataEquals(propsA.entryData, propsB.entryData) &&
    propsA.isSelected === propsB.isSelected
);

export default CartographyAssociationRow;
