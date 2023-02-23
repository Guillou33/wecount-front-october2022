import { useSelector, useDispatch } from "react-redux";
import { t } from "i18next";
import { upperFirst } from "lodash";

import { ModaleVariant } from "@components/campaign/data-import/sub/multi-action/MultiActionModale";

import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import { RootState } from "@reducers/index";

import selectIsCompletionDone from "@selectors/dataImport/selectIsCompletionDone";
import selectCompletionStepColumnsPaginated from "@selectors/dataImport/selectCompletionStepColumnsPaginated";
import selectVisibleColumns from "@selectors/dataImport/selectVisibleColumns";
import selectActivityModelIdOfSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectActivityModelIdOfSelectedEntryData";
import selectComputeMethodsOfSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectComputeMethodsOfSelectedEntryData";
import selectEmissionFactorIdsOfSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectEmissionFactorIdsOfSelectedEntryData";
import useEntryDataSelectionComputer from "@hooks/data-import/useEntryDataSelectionComputer";
import selectFilteredEntryData from "@selectors/dataImport/filteredEntryData/selectFilteredEntryData";

import Step from "./Step";
import BottomBar from "./sub/BottomBar";
import CompletionRow from "./sub/CompletionRow";
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
  onPreviousStepClick: () => void;
  onCancelClick: () => void;
  onNextStepClick: () => void;
  onColumnSettingsClick: () => void;
  onMultiActionClick: (variant: ModaleVariant) => void;
}

const StepCompletion = ({
  onCancelClick,
  onNextStepClick,
  onPreviousStepClick,
  onColumnSettingsClick,
  onMultiActionClick,
}: Props) => {
  const dispatch = useDispatch();

  const entryDataList = useSelector((state: RootState) =>
    selectFilteredEntryData(state)
  );
  const columns = useSelector(selectCompletionStepColumnsPaginated);
  const viewOffset = useSelector(
    (state: RootState) => state.dataImport.tableSettings.columnViewOffset
  );
  const allColumns = useSelector(selectVisibleColumns);

  const isCompletionDone = useSelector(selectIsCompletionDone);

  const activityModelsOfSelection = useSelector((state: RootState) =>
    selectActivityModelIdOfSelectedEntryData(state)
  );
  const emissionFactorsOfSelection = useSelector((state: RootState) =>
    selectEmissionFactorIdsOfSelectedEntryData(state)
  );

  const isSelectionValidForComputeMethodEdition =
    activityModelsOfSelection.length === 1 &&
    activityModelsOfSelection[0] != null;

  const computeMethodsOfselection = useSelector((state: RootState) =>
    selectComputeMethodsOfSelectedEntryData(state)
  );
  const isSelectionValidForEmissionFactorEdition =
    computeMethodsOfselection.length === 1 &&
    computeMethodsOfselection[0] != null &&
    computeMethodsOfselection[0] !== ComputeMethodType.DEPRECATED_EMISSION_FACTOR &&
    computeMethodsOfselection[0] !== ComputeMethodType.RAW_DATA;

  const isSelectionValidForUnitsEdition =
    emissionFactorsOfSelection.length === 1 &&
    emissionFactorsOfSelection[0] != null;

  const isEntryDataSelected = useEntryDataSelectionComputer();

  return (
    <Step
      title={upperFirst(t("dataImport.steps.fillIn.title"))}
      content={
        <>
          <p>{upperFirst(t("dataImport.steps.fillIn.description"))}</p>
          <EntryDataTable
            entryDataList={entryDataList}
            renderEntryData={entryData => (
              <CompletionRow
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
                      onClick={() => onMultiActionClick("edit-site")}
                    >
                      <img
                        src={`/icons/modale/icon-map-pin-lighter.svg`}
                        alt=""
                        style={{ transform: "translateY(-3px)" }}
                      />
                      {upperFirst(
                        t("dataImport.multiActions.actionNames.editSite")
                      )}
                    </Dropdown.Button>
                    <Dropdown.Button
                      className={className}
                      onClick={() => onMultiActionClick("edit-product")}
                    >
                      <img
                        src={`/icons/modale/icon-box-lighter.svg`}
                        alt=""
                        style={{ transform: "translateY(-3px)" }}
                      />
                      {upperFirst(
                        t("dataImport.multiActions.actionNames.editProduct")
                      )}
                    </Dropdown.Button>
                    <Dropdown.Button
                      className={className}
                      onClick={() => onMultiActionClick("edit-owner")}
                    >
                      <i className="fa fa-user-tag" />
                      {upperFirst(
                        t("dataImport.multiActions.actionNames.editOwner")
                      )}
                    </Dropdown.Button>
                    <Dropdown.Button
                      className={className}
                      onClick={() => onMultiActionClick("edit-writer")}
                    >
                      <i className="fa fa-user-edit" />
                      {upperFirst(
                        t("dataImport.multiActions.actionNames.editWriter")
                      )}
                    </Dropdown.Button>
                    <Dropdown.Button
                      className={className}
                      onClick={() => onMultiActionClick("edit-tags")}
                    >
                      <i className="fas fa-tag" />
                      {upperFirst(
                        t("dataImport.multiActions.actionNames.editTags")
                      )}
                    </Dropdown.Button>
                    <Tooltip
                      content={
                        !isSelectionValidForComputeMethodEdition
                          ? upperFirst(
                              t(
                                "dataImport.multiActions.userFeedbacks.invalidActivityModelSelection",
                                {
                                  count: activityModelsOfSelection.length,
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
                        onClick={() =>
                          isSelectionValidForComputeMethodEdition &&
                          onMultiActionClick("edit-compute-method")
                        }
                        showAsDisabled={
                          !isSelectionValidForComputeMethodEdition
                        }
                      >
                        <i className="fas fa-calculator" />
                        {upperFirst(
                          t(
                            "dataImport.multiActions.actionNames.editComputeMethod"
                          )
                        )}
                      </Dropdown.Button>
                    </Tooltip>
                    <Tooltip
                      content={
                        !isSelectionValidForEmissionFactorEdition
                          ? upperFirst(
                              t(
                                "dataImport.multiActions.userFeedbacks.invalidComputeMethodSelection",
                                {
                                  count: activityModelsOfSelection.length,
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
                        onClick={() =>
                          isSelectionValidForEmissionFactorEdition &&
                          onMultiActionClick("edit-emission-factor")
                        }
                        showAsDisabled={
                          !isSelectionValidForEmissionFactorEdition
                        }
                      >
                        <img
                          src={`/icons/modale/icon-emission-gef${
                            isSelectionValidForEmissionFactorEdition
                              ? ""
                              : "-lighter"
                          }.svg`}
                          alt=""
                          style={{ transform: "translateY(-3px)" }}
                        />
                        {upperFirst(
                          t("dataImport.multiActions.actionNames.editEf")
                        )}
                      </Dropdown.Button>
                    </Tooltip>
                    <Tooltip
                      content={
                        !isSelectionValidForUnitsEdition
                          ? upperFirst(
                              t(
                                "dataImport.multiActions.userFeedbacks.invalidEmissionFactorSelection",
                                {
                                  count: emissionFactorsOfSelection.length,
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
                        onClick={() =>
                          isSelectionValidForUnitsEdition &&
                          onMultiActionClick("edit-units")
                        }
                        showAsDisabled={!isSelectionValidForUnitsEdition}
                      >
                        <i className="fas fa-wrench"></i>
                        {upperFirst(
                          t("dataImport.multiActions.actionNames.editUnits")
                        )}
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
                onNextClick={() => dispatch(moveColumnViewRight())}
              />
            }
          />
        </>
      }
      bottomBar={
        <BottomBar
          isNextStepEnabled={isCompletionDone}
          nextStepLabel={upperFirst(t("dataImport.common.finish"))}
          onCancelClick={onCancelClick}
          onPreviousStepClick={onPreviousStepClick}
          onNextStepClick={onNextStepClick}
        />
      }
    />
  );
};

export default StepCompletion;
