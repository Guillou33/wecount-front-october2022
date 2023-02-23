import { useDispatch } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import cx from "classnames";

import { RootState } from "@reducers/index";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";

import selectActivityModelIdOfSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectActivityModelIdOfSelectedEntryData";
import selectComputeMethodsOfSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectComputeMethodsOfSelectedEntryData";
import { setEmissionFactor as setEmissionFactorOfEntries } from "@actions/dataImport/entryData/entryDataActions";
import { getComputeMethodsWithEfIfNeeded } from "@actions/core/emissionFactor/emissionFactorActions";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import Spinner from "@components/helpers/ui/Spinner";
import BaseModale from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";
import PrivateBadge from "@components/core/PrivateBadge";

import styles from "@styles/campaign/data-import/sub/multi-actions/modale-variants/editAllComputeMethodModale.module.scss";

const EditAllEmissionFactorModale = () => {
  const dispatch = useDispatch();

  const selectedActivityModelsIds = useSelector(
    selectActivityModelIdOfSelectedEntryData
  );
  const computeMethodsOfselection = useSelector(
    selectComputeMethodsOfSelectedEntryData
  );
  const isSelectionValid =
    computeMethodsOfselection.length === 1 &&
    computeMethodsOfselection[0] != null &&
    computeMethodsOfselection[0] !== ComputeMethodType.DEPRECATED_EMISSION_FACTOR &&
    computeMethodsOfselection[0] !== ComputeMethodType.RAW_DATA;

  const computeMethodIdOfSelection = Number(computeMethodsOfselection[0]);
  const computeMethods = useSelector((state: RootState) =>
    isSelectionValid
      ? state.core.emissionFactor.mapping[selectedActivityModelsIds[0] ?? -1]
      : {}
  );

  const emissionFactorMappings =
    computeMethods?.[computeMethodIdOfSelection]?.emissionFactorMappings ?? [];

  const [emissionFactorId, setEmissionFactorId] = useState<number | null>(null);

  const previewEmissionFactor = emissionFactorMappings.find(
    efm => efm.emissionFactor.id === emissionFactorId
  )?.emissionFactor.name;

  useEffect(() => {
    if (isSelectionValid) {
      dispatch(getComputeMethodsWithEfIfNeeded(computeMethodIdOfSelection));
    }
  }, [isSelectionValid, computeMethodIdOfSelection]);

  return (
    <BaseModale
      renderTitle={count =>
        upperFirst(t("dataImport.multiActions.actionTitles.editEf", { count }))
      }
      icon={
        <img
          src={`/icons/modale/icon-emission-gef-darker.svg`}
          alt=""
          style={{ transform: "translateY(-3px)" }}
        />
      }
      onApplyButtonClick={entryDataIds => {
        if (isSelectionValid && emissionFactorId != null) {
          dispatch(
            setEmissionFactorOfEntries({
              entryDataIds,
              emissionFactor: {
                id: emissionFactorId,
                name: previewEmissionFactor ?? "",
              },
            })
          );
        }
      }}
      applyButtonLabel={upperFirst(t("global.modify"))}
      renderControls={
        <SelectOne
          selected={emissionFactorId}
          onOptionClick={setEmissionFactorId}
          placeholder={upperFirst(
            t("dataImport.multiActions.actionPlaceholders.chooseEf")
          )}
        >
          {ctx =>
            computeMethods == null ? (
              <Spinner
                className={styles.spinnerContainer}
                spinnerClassName={styles.spinner}
              >
                {upperFirst(t("dataImport.common.loading"))}
              </Spinner>
            ) : (
              <>
                {emissionFactorMappings.map(efm => {
                  const isEfDisabled =
                    efm.emissionFactor.notVisible ||
                    efm.emissionFactor.archived;
                  return (
                    <Option {...ctx} value={efm.emissionFactor.id}>
                      <div className={cx(styles.efLabelContainer)}>
                        {efm.emissionFactor.name}
                        {efm.recommended && !isEfDisabled && (
                          <i
                            className={cx(styles.infoIcon, "ml-2 fas fa-award")}
                          ></i>
                        )}
                        {isEfDisabled && (
                          <i
                            className={cx(
                              styles.infoIcon,
                              "ml-2 fas fa-archive"
                            )}
                          ></i>
                        )}
                        {efm.emissionFactor.isPrivate && <PrivateBadge />}
                      </div>
                    </Option>
                  );
                })}
              </>
            )
          }
        </SelectOne>
      }
      previewValues={{
        emissionFactor: previewEmissionFactor,
      }}
    />
  );
};

export default EditAllEmissionFactorModale;
