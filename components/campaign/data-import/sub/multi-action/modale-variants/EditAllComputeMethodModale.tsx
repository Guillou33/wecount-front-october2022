import { useDispatch } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";

import { RootState } from "@reducers/index";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";

import selectActivityModelIdOfSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectActivityModelIdOfSelectedEntryData";
import { setComputeMethod as setComputeMethodOfEntries } from "@actions/dataImport/entryData/entryDataActions";
import { getComputeMethodsWithEfIfNeeded } from "@actions/core/emissionFactor/emissionFactorActions";

import {
  ComputeMethod,
  getComputeMethodValue,
  isNonStandardType,
  isStandard,
} from "@lib/core/dataImport/computeMethod";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import Spinner from "@components/helpers/ui/Spinner";
import BaseModale from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";

import styles from "@styles/campaign/data-import/sub/multi-actions/modale-variants/editAllComputeMethodModale.module.scss";

const EditAllComputeMethodModale = () => {
  const dispatch = useDispatch();

  const selectedActivityModelsIds = useSelector(
    selectActivityModelIdOfSelectedEntryData
  );
  const isSelectionValid =
    selectedActivityModelsIds.length === 1 &&
    selectedActivityModelsIds[0] != null;

  const activityModelOfSelection = selectedActivityModelsIds[0] ?? -1;
  const computeMethods = useSelector((state: RootState) =>
    isSelectionValid
      ? state.core.emissionFactor.mapping[activityModelOfSelection]
      : {}
  );

  const [computeMethod, setComputeMethod] = useState<ComputeMethod | null>(
    null
  );
  const computeMethodValue = getComputeMethodValue(computeMethod);

  function getComputeMethodPreview() {
    if (computeMethod == null) {
      return undefined;
    }
    if (isStandard(computeMethod)) {
      return computeMethods?.[computeMethod.id]?.name;
    }
    if (computeMethod.type === ComputeMethodType.RAW_DATA) {
      return upperFirst(t("entry.computeMethod.insertRawData"));
    }
    if (computeMethod.type === ComputeMethodType.DEPRECATED_EMISSION_FACTOR) {
      return upperFirst(t("entry.computeMethod.createEmissionFactor"));
    }
  }
  const computeMethodPreview = getComputeMethodPreview();

  useEffect(() => {
    if (isSelectionValid && activityModelOfSelection !== -1) {
      dispatch(getComputeMethodsWithEfIfNeeded(activityModelOfSelection));
    }
  }, [isSelectionValid, activityModelOfSelection]);

  return (
    <BaseModale
      renderTitle={count =>
        upperFirst(
          t("dataImport.multiActions.actionTitles.editComputeMethod", { count })
        )
      }
      icon={<i className="fas fa-calculator" />}
      onApplyButtonClick={entryDataIds => {
        if (isSelectionValid && computeMethod != null) {
          dispatch(
            setComputeMethodOfEntries({
              entryDataIds,
              computeMethod: {
                ...computeMethod,
                ...(isStandard(computeMethod)
                  ? { name: computeMethodPreview ?? "" }
                  : {}),
              },
            })
          );
        }
      }}
      applyButtonLabel={upperFirst(t("global.modify"))}
      renderControls={
        <SelectOne
          selected={computeMethodValue}
          onOptionClick={value => {
            if (isNonStandardType(value)) {
              setComputeMethod({
                type: value,
              });
            } else {
              setComputeMethod({
                type: ComputeMethodType.STANDARD,
                id: Number(value),
                name: "",
              });
            }
          }}
          placeholder={upperFirst(
            t("dataImport.multiActions.actionPlaceholders.chooseComputeMethod")
          )}
        >
          {props =>
            computeMethods == null ? (
              <Spinner
                className={styles.spinnerContainer}
                spinnerClassName={styles.spinner}
              >
                {upperFirst(t("dataImport.common.loading"))}
              </Spinner>
            ) : (
              <>
                {Object.values(computeMethods).map(({ id, name }) => (
                  <Option {...props} key={id} value={id.toString()}>
                    {name}
                  </Option>
                ))}
                <Option {...props} value={ComputeMethodType.RAW_DATA}>
                  {upperFirst(t("entry.computeMethod.insertRawData"))}
                </Option>
              </>
            )
          }
        </SelectOne>
      }
      previewValues={{
        computeMethod: computeMethodPreview,
        emissionFactor: computeMethodPreview != null ? "" : undefined,
      }}
    />
  );
};

export default EditAllComputeMethodModale;
