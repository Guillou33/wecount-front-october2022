import { useSelector, useDispatch } from "react-redux";
import { t } from "i18next";
import { upperFirst } from "lodash";

import { RootState } from "@reducers/index";
import { ModaleVariant } from "@components/campaign/data-import/sub/multi-action/MultiActionModale";

import selectFilteredEntryData from "@selectors/dataImport/filteredEntryData/selectFilteredEntryData";
import selectIsCartographyAssociationDone from "@selectors/dataImport/selectIsCartographyAssociationDone";
import selectCartographyAssociationColumnsPaginated from "@selectors/dataImport/selectCartographyAssociationColumnsPaginated";
import selectCartographyAssociationColumns from "@selectors/dataImport/selectCartographyAssociationColumns";
import selectCategoryIdsOfSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectCategoryIdsOfSelectedEntryData";
import { cartographyAssociationIgnoredColumns } from "@lib/core/dataImport/columnConfig";
import useEntryDataSelectionComputer from "@hooks/data-import/useEntryDataSelectionComputer";

import Step from "./Step";
import Spinner from "@components/helpers/ui/Spinner";
import CartographyAssociationRow from "./sub/CartographyAssociationRow";
import BottomBar from "./sub/BottomBar";
import EntryDataTable from "./sub/EntryDataTable";
import TableHeader from "./sub/TableHeader";
import Dropdown from "@components/helpers/ui/dropdown/Dropdown";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import PaginationScroller from "@components/campaign/data-import/sub/steps/sub/PaginationScroller";

import {
  moveColumnViewLeft,
  moveColumnViewRight,
  setColumnPage,
} from "@actions/dataImport/tableSettings/tableSettingsAction";

interface Props {
  campaignId: number;
  onPreviousStepClick: () => void;
  onCancelClick: () => void;
  onNextStepClick: () => void;
  onColumnSettingsClick: () => void;
  onMultiActionClick: (variant: ModaleVariant) => void;
}

const StepCartographyAssociation = ({
  campaignId,
  onCancelClick,
  onPreviousStepClick,
  onNextStepClick,
  onColumnSettingsClick,
  onMultiActionClick,
}: Props) => {
  const dispatch = useDispatch();

  const isParsing = useSelector(
    (state: RootState) => state.dataImport.entryData.entryDataIsParsing
  );
  const columns = useSelector(selectCartographyAssociationColumnsPaginated);
  const viewOffset = useSelector(
    (state: RootState) => state.dataImport.tableSettings.columnViewOffset
  );
  const allColumns = useSelector(selectCartographyAssociationColumns);

  const entryDataList = useSelector((state: RootState) =>
    selectFilteredEntryData(state)
  );
  const isCartographyAssociationDone = useSelector(
    selectIsCartographyAssociationDone
  );

  const isEntryDataSelected = useEntryDataSelectionComputer();

  const categoriesOfSelection = useSelector((state: RootState) =>
    selectCategoryIdsOfSelectedEntryData(state)
  );
  const isSelectionValidForActivityMultiEdition =
    categoriesOfSelection.length === 1 && categoriesOfSelection[0] != null;

  return (
    <Step
      title={upperFirst(t("dataImport.steps.tidyUp.title"))}
      content={
        <>
          <p>{upperFirst(t("dataImport.steps.tidyUp.description"))}</p>
          {isParsing ? (
            <Spinner>
              {upperFirst(t("dataImport.userFeedback.loadingFile"))}
            </Spinner>
          ) : (
            <EntryDataTable
              entryDataList={entryDataList}
              renderEntryData={entryData => (
                <CartographyAssociationRow
                  campaignId={campaignId}
                  entryData={entryData}
                  key={entryData.id}
                  isSelected={isEntryDataSelected(entryData.id)}
                />
              )}
              tableHeader={
                <TableHeader
                  columns={columns}
                  onColumnSettingsClick={onColumnSettingsClick}
                  renderMultiActions={className => (
                    <>
                      <Dropdown.Button
                        className={className}
                        onClick={() => onMultiActionClick("edit-category")}
                      >
                        <i className="fas fa-list-alt" />
                        {upperFirst(
                          t("dataImport.multiActions.actionNames.editCategory")
                        )}
                      </Dropdown.Button>
                      <Tooltip
                        content={
                          !isSelectionValidForActivityMultiEdition
                            ? upperFirst(
                                t(
                                  "dataImport.multiActions.userFeedbacks.invalidCategorySelection",
                                  {
                                    count: categoriesOfSelection.length,
                                  }
                                )
                              )
                            : null
                        }
                        placement="right"
                        showDelay={0}
                        hideDelay={0}
                      >
                        <Dropdown.Button
                          className={className}
                          onClick={() => {
                            isSelectionValidForActivityMultiEdition &&
                              onMultiActionClick("edit-activity");
                          }}
                          showAsDisabled={
                            !isSelectionValidForActivityMultiEdition
                          }
                        >
                          <>
                            <i className="far fa-list-alt" />
                            {upperFirst(
                              t(
                                "dataImport.multiActions.actionNames.editActivity"
                              )
                            )}
                          </>
                        </Dropdown.Button>
                      </Tooltip>
                      <Dropdown.Button
                        className={className}
                        onClick={() => onMultiActionClick("delete-all")}
                      >
                        <i className="fa fa-trash" />
                        {upperFirst(
                          t("dataImport.multiActions.actionNames.deleteAll")
                        )}
                      </Dropdown.Button>
                    </>
                  )}
                />
              }
              scroller={
                <PaginationScroller
                  totalLength={allColumns.length}
                  scrollerLength={columns.length}
                  scrollOffset={viewOffset}
                  onScollChange={page => dispatch(setColumnPage({ page }))}
                  onPreviousClick={() => dispatch(moveColumnViewLeft())}
                  onNextClick={() =>
                    dispatch(
                      moveColumnViewRight({
                        ignoredColumns: cartographyAssociationIgnoredColumns,
                      })
                    )
                  }
                />
              }
            />
          )}
        </>
      }
      bottomBar={
        <BottomBar
          isNextStepEnabled={isCartographyAssociationDone}
          onCancelClick={onCancelClick}
          onNextStepClick={onNextStepClick}
          onPreviousStepClick={onPreviousStepClick}
        />
      }
    />
  );
};

export default StepCartographyAssociation;
