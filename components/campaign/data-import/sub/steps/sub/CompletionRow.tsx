import { memo } from "react";
import { useDispatch } from "react-redux";
import cx from "classnames";
import { t } from "i18next";
import { upperFirst } from "lodash";
import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { EntryData } from "@reducers/dataImport/entryDataReducer";
import { PerimeterRole } from "@custom-types/wecount-api/auth";
import { ColumnName } from "@lib/core/dataImport/columnConfig";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import {
  NumberDataNames,
  StringDataNames,
} from "@lib/core/dataImport/mappableData";

import useCategoryInfo from "@hooks/core/useCategoryInfo";
import useActivityModelInfo from "@hooks/core/useActivityModelInfo";
import useAllSiteList from "@hooks/core/useAllSiteList";
import useAllProductList from "@hooks/core/useAllProductList";
import useAllUsers from "@hooks/core/useAllUsers";
import useAllEntryTags from "@hooks/core/useAllEntryTags";
import selectCompletionStepColumnsPaginated from "@selectors/dataImport/selectCompletionStepColumnsPaginated";

import {
  setMappableData,
  setNumberData,
  setStringData,
  tagClicked,
  setEmissionFactor,
} from "@actions/dataImport/entryData/entryDataActions";
import { toggleEntryData } from "@actions/dataImport/entryDataSelection/entryDataSelectionActions";

import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import MappableCell from "./MappableCell";
import TagMappingCell from "./TagMappingCell";
import ComputeMethodCell from "./ComputeMethodCell";
import EmissionFactorCell from "./EmissionFactorCell";
import RowFeedback from "./RowFeedback";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import Checkbox from "@components/helpers/ui/Checkbox";

import { canBeCoercedToNumber } from "@lib/utils/canBeCoercedToNumber";
import areEntryDataEquals from "@lib/core/dataImport/areEntryDataEqual";
import { getErrorsForCompletion } from "@lib/core/dataImport/getEntryDataError";
import { getWarningsForCompletion } from "@lib/core/dataImport/getEntryDataWarning";
import getCoreEmissionFactor from "@lib/core/dataImport/getCoreEmissionFactor";

import styles from "@styles/campaign/data-import/sub/steps/sub/completionRow.module.scss";

interface Props {
  entryData: EntryData;
  isSelected: boolean;
}

const CompletionRow = memo(
  ({ entryData, isSelected }: Props) => {
    const dispatch = useDispatch();

    const categoryInfo = useCategoryInfo();
    const activityModelInfo = useActivityModelInfo();
    const emissionFActorMapping = useSelector(
      (state: RootState) => state.core.emissionFactor.mapping
    );

    const columns = useSelector(selectCompletionStepColumnsPaginated);

    const categoryName =
      categoryInfo[entryData.activityCategory.value ?? -1]?.name ?? "";
    const activitymodelName =
      activityModelInfo[entryData.activityModel.value ?? -1]?.name ?? "";

    const sites = useAllSiteList({ includeSubSites: true });
    const availableSites = Object.values(sites).map(({ id, name }) => ({
      id,
      label: name,
    }));

    const products = useAllProductList();
    const availableProducts = Object.values(products).map(({ id, name }) => ({
      id,
      label: name,
    }));

    const users = useAllUsers();
    const defaultUser = { id: -1, label: upperFirst(t("entry.unaffected")) };
    const availableWriters = users.map(({ id, email }) => ({
      id,
      label: email,
    }));
    const availableOwners = users
      .filter(
        user =>
          user.roleWithinPerimeter !== PerimeterRole.PERIMETER_CONTRIBUTOR &&
          user.roleWithinPerimeter !== PerimeterRole.PERIMETER_COLLABORATOR
      )
      .map(({ id, email }) => ({
        id,
        label: email,
      }));

    const entryTags = useAllEntryTags();
    const availableTags = entryTags.map(({ id, name }) => ({
      id,
      label: name,
    }));

    const emissionFactorMapping = useSelector((state: RootState) => {
      return state.core.emissionFactor.mapping;
    });

    const emissionFactor = getCoreEmissionFactor(
      entryData,
      emissionFactorMapping
    );

    function handleInputChange(dataName: NumberDataNames) {
      return (rawValue: string) => {
        const value = rawValue === "" ? null : parseFloat(rawValue);
        dispatch(setNumberData({ dataName, entryDataId: entryData.id, value }));
      };
    }

    function handleStringDataChange(dataName: StringDataNames) {
      return (value: string) => {
        dispatch(setStringData({ dataName, entryDataId: entryData.id, value }));
      };
    }

    const errors = getErrorsForCompletion(entryData, emissionFActorMapping);
    const hasError = errors.length > 0;
    const input1UnitHasError = errors.includes(ColumnName.INPUT_1_UNIT);
    const input2UnitHasError = errors.includes(ColumnName.INPUT_2_UNIT);

    const warnings = getWarningsForCompletion(entryData, emissionFactorMapping);
    const hasWarnings = warnings.length > 0;

    const input1HasWarning = warnings.includes(ColumnName.INPUT_1);
    const input2HasWarning = warnings.includes(ColumnName.INPUT_2);

    function getInput2Feedback() {
      if (!input2HasWarning) {
        return null;
      }
      if (entryData.input2 == null) {
        return upperFirst(t("dataImport.userFeedback.input2Warning"));
      }
      return upperFirst(t("dataImport.userFeedback.input2Ignored"));
    }

    return (
      <div
        className={cx(styles.row, {
          [styles.hasError]: hasError,
          [styles.hasWarning]: !hasError && hasWarnings,
        })}
      >
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
          const { entryDataKey } = column;
          switch (entryDataKey) {
            case "activityCategory":
              return <td key={entryDataKey}>{categoryName}</td>;
            case "activityModel":
              return <td key={entryDataKey}>{activitymodelName}</td>;
            case "site":
              return (
                <MappableCell
                  key={entryDataKey}
                  data={entryData.site}
                  possibleValues={availableSites}
                  onChange={(id, entityName) =>
                    dispatch(
                      setMappableData({
                        dataName: "site",
                        entryDataIds: [entryData.id],
                        id,
                        entityName,
                      })
                    )
                  }
                  allowNull
                />
              );
            case "product":
              return (
                <MappableCell
                  key={entryDataKey}
                  data={entryData.product}
                  possibleValues={availableProducts}
                  onChange={(id, entityName) =>
                    dispatch(
                      setMappableData({
                        dataName: "product",
                        entryDataIds: [entryData.id],
                        id,
                        entityName,
                      })
                    )
                  }
                  allowNull
                />
              );
            case "inputInstruction":
              return (
                <td key={entryDataKey}>
                  <Tooltip
                    hideDelay={0}
                    showDelay={0}
                    content={entryData.inputInstruction}
                  >
                    <div className={cx("default-field", styles.defaultField)}>
                      <SelfControlledInput
                        className="field"
                        placeholder={upperFirst(
                          t("entry.instruction.instruction")
                        )}
                        value={entryData.inputInstruction}
                        onHtmlChange={handleStringDataChange(
                          "inputInstruction"
                        )}
                      />
                    </div>
                  </Tooltip>
                </td>
              );
            case "tags":
              return (
                <TagMappingCell
                  key={entryDataKey}
                  data={entryData.tags}
                  possibleValues={availableTags}
                  onChange={(tagId, tagName) =>
                    dispatch(
                      tagClicked({ entryDataId: entryData.id, tagId, tagName })
                    )
                  }
                />
              );
            case "computeMethod":
              return (
                <ComputeMethodCell
                  key={entryDataKey}
                  activityModelId={entryData.activityModel.value ?? -1}
                  entryDataId={entryData.id}
                  computeMethod={entryData.computeMethod}
                />
              );
            case "emissionFactor":
              return (
                <EmissionFactorCell
                  key={entryDataKey}
                  activitymodelId={entryData.activityModel.value ?? -1}
                  computeMethod={entryData.computeMethod}
                  emissionFactorId={entryData.emissionFactor?.id ?? null}
                  onChange={(id, name) =>
                    dispatch(
                      setEmissionFactor({
                        entryDataIds: [entryData.id],
                        emissionFactor: {
                          id,
                          name,
                        },
                      })
                    )
                  }
                />
              );
            case "input1":
              return (
                <td key={entryDataKey}>
                  <Tooltip
                    content={
                      input1HasWarning
                        ? upperFirst(t("dataImport.userFeedback.input1Warning"))
                        : null
                    }
                    hideDelay={0}
                    showDelay={0}
                  >
                    <div className={cx("default-field", styles.defaultField)}>
                      <SelfControlledInput
                        className={cx("field", "text-right", {
                          [styles.hasWarning]: input1HasWarning,
                        })}
                        placeholder={upperFirst(t("dataImport.fields.input1"))}
                        value={entryData.input1}
                        validateChange={canBeCoercedToNumber}
                        onHtmlChange={handleInputChange("input1")}
                      />
                    </div>
                  </Tooltip>
                </td>
              );
            case "input1Unit":
              return (
                <td key={entryDataKey} className={styles.unitCell}>
                  <Tooltip
                    content={
                      input1UnitHasError
                        ? upperFirst(
                            t("dataImport.userFeedback.unitMismatch", {
                              unit: emissionFactor?.input1Unit,
                            })
                          )
                        : null
                    }
                    hideDelay={0}
                    showDelay={0}
                  >
                    <div className={cx("default-field", styles.defaultField)}>
                      <SelfControlledInput
                        className={cx("field text-right", styles.unitInput, {
                          [styles.hasError]: input1UnitHasError,
                        })}
                        value={entryData.input1Unit}
                        onHtmlChange={handleStringDataChange("input1Unit")}
                      />
                    </div>
                  </Tooltip>
                  {input1UnitHasError && (
                    <Tooltip
                      content={upperFirst(
                        t("dataImport.userFeedback.unitButton")
                      )}
                      hideDelay={0}
                      showDelay={0}
                    >
                      <button
                        className={cx("button-1", styles.unitButton)}
                        onClick={() => {
                          const unit = emissionFactor?.input1Unit;
                          if (unit != null) {
                            handleStringDataChange("input1Unit")(unit);
                          }
                        }}
                      >
                        <i className="far fa-edit"></i>
                      </button>
                    </Tooltip>
                  )}
                </td>
              );
            case "input2":
              return (
                <td key={entryDataKey}>
                  <Tooltip
                    content={getInput2Feedback()}
                    hideDelay={0}
                    showDelay={0}
                  >
                    <div className={cx("default-field", styles.defaultField)}>
                      <SelfControlledInput
                        className={cx("field", "text-right", {
                          [styles.hasWarning]: input2HasWarning,
                        })}
                        placeholder={upperFirst(t("dataImport.fields.input2"))}
                        value={entryData.input2}
                        validateChange={canBeCoercedToNumber}
                        onHtmlChange={handleInputChange("input2")}
                        disabled={
                          entryData.computeMethod != null &&
                          entryData.computeMethod.type ===
                            ComputeMethodType.RAW_DATA
                        }
                      />
                    </div>
                  </Tooltip>
                </td>
              );
            case "input2Unit":
              return (
                <td key={entryDataKey} className={styles.unitCell}>
                  <Tooltip
                    content={
                      input2UnitHasError
                        ? upperFirst(
                            t("dataImport.userFeedback.unitMismatch", {
                              unit: emissionFactor?.input2Unit,
                            })
                          )
                        : null
                    }
                    hideDelay={0}
                    showDelay={0}
                  >
                    <div className={cx("default-field", styles.defaultField)}>
                      <SelfControlledInput
                        className={cx("field text-right", styles.unitInput, {
                          [styles.hasError]: input2UnitHasError,
                        })}
                        value={entryData.input2Unit}
                        onHtmlChange={handleStringDataChange("input2Unit")}
                        disabled={
                          entryData.computeMethod != null &&
                          entryData.computeMethod.type ===
                            ComputeMethodType.RAW_DATA
                        }
                      />
                    </div>
                  </Tooltip>
                  {input2UnitHasError && (
                    <Tooltip
                      content={upperFirst(
                        t("dataImport.userFeedback.unitButton")
                      )}
                      hideDelay={0}
                      showDelay={0}
                    >
                      <button
                        className={cx("button-1", styles.unitButton)}
                        onClick={() => {
                          const unit = emissionFactor?.input2Unit;
                          if (unit != null) {
                            handleStringDataChange("input2Unit")(unit);
                          }
                        }}
                      >
                        <i className="far fa-edit"></i>
                      </button>
                    </Tooltip>
                  )}
                </td>
              );
            case "commentary":
              return (
                <td key={entryDataKey}>
                  <Tooltip
                    hideDelay={0}
                    showDelay={0}
                    content={entryData.commentary}
                  >
                    <div className={cx("default-field", styles.defaultField)}>
                      <SelfControlledInput
                        className="field"
                        placeholder={upperFirst(
                          t("entry.comment.comment.singular")
                        )}
                        value={entryData.commentary}
                        onHtmlChange={handleStringDataChange("commentary")}
                      />
                    </div>
                  </Tooltip>
                </td>
              );
            case "source":
              return (
                <td key={entryDataKey}>
                  <Tooltip
                    hideDelay={0}
                    showDelay={0}
                    content={entryData.source}
                  >
                    <div className={cx("default-field", styles.defaultField)}>
                      <SelfControlledInput
                        className="field"
                        placeholder={upperFirst(t("entry.comment.source"))}
                        value={entryData.source}
                        onHtmlChange={handleStringDataChange("source")}
                      />
                    </div>
                  </Tooltip>
                </td>
              );
            case "owner":
              return (
                <MappableCell
                  key={entryDataKey}
                  data={entryData.owner}
                  possibleValues={[...availableOwners, { ...defaultUser }]}
                  onChange={(id, entityName) =>
                    dispatch(
                      setMappableData({
                        dataName: "owner",
                        entryDataIds: [entryData.id],
                        id,
                        entityName,
                      })
                    )
                  }
                />
              );
            case "writer":
              return (
                <MappableCell
                  key={entryDataKey}
                  data={entryData.writer}
                  possibleValues={[...availableWriters, { ...defaultUser }]}
                  onChange={(id, entityName) =>
                    dispatch(
                      setMappableData({
                        dataName: "writer",
                        entryDataIds: [entryData.id],
                        id,
                        entityName,
                      })
                    )
                  }
                />
              );
          }
        })}
        <td>
          <RowFeedback errorsOnColumns={errors} warningsOnColumns={warnings} />
        </td>
      </div>
    );
  },

  (propsA, propsB) =>
    areEntryDataEquals(propsA.entryData, propsB.entryData) &&
    propsA.isSelected === propsB.isSelected
);

export default CompletionRow;
