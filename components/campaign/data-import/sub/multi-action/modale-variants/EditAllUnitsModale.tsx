import { useDispatch, useSelector } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useEffect, useState } from "react";
import cx from "classnames";

import { RootState } from "@reducers/index";

import selectActivityModelIdOfSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectActivityModelIdOfSelectedEntryData";
import selectComputeMethodsOfSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectComputeMethodsOfSelectedEntryData";
import { getComputeMethodsWithEfIfNeeded } from "@actions/core/emissionFactor/emissionFactorActions";

import selectEmissionFactorIdsOfSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectEmissionFactorIdsOfSelectedEntryData";
import { setMultiEntryInputUnits } from "@actions/dataImport/entryData/entryDataActions";

import BaseModale from "@components/campaign/data-import/sub/multi-action/modale-variants/BaseModale";
import SelfControlledInput from "@components/helpers/form/field/SelfControlledInput";
import Tooltip from "@components/helpers/bootstrap/Tooltip";

import styles from "@styles/campaign/data-import/sub/multi-actions/modale-variants/editAllUnitsModale.module.scss";

interface Props {}

const EditAllUnitsModale = ({}: Props) => {
  const dispatch = useDispatch();

  const selectedActivityModelsIds = useSelector(
    selectActivityModelIdOfSelectedEntryData
  );
  const computeMethodsOfselection = useSelector(
    selectComputeMethodsOfSelectedEntryData
  );
  const emissionFactorIdsOfSelection = useSelector(
    selectEmissionFactorIdsOfSelectedEntryData
  );
  const isSelectionValid =
    emissionFactorIdsOfSelection.length === 1 &&
    emissionFactorIdsOfSelection[0] != null;

  const computeMethodIdOfSelection = Number(computeMethodsOfselection[0]);
  const computeMethods = useSelector((state: RootState) =>
    isSelectionValid
      ? state.core.emissionFactor.mapping[selectedActivityModelsIds[0] ?? -1]
      : {}
  );

  const emissionFactorMappings =
    computeMethods?.[computeMethodIdOfSelection]?.emissionFactorMappings ?? [];

  const {
    input1Unit: correctInput1Unit = null,
    input2Unit: correctInput2Unit = null,
  } =
    emissionFactorMappings.find(
      efm => efm.emissionFactor.id === emissionFactorIdsOfSelection[0]
    )?.emissionFactor ?? {};

  const [input1Unit, setInput1Unit] = useState("");
  const [input2Unit, setInput2Unit] = useState("");

  const previewInput1Unit = input1Unit != "" ? input1Unit : undefined;
  const previewInput2Unit = input2Unit != "" ? input2Unit : undefined;

  useEffect(() => {
    if (isSelectionValid) {
      dispatch(getComputeMethodsWithEfIfNeeded(computeMethodIdOfSelection));
    }
  }, [isSelectionValid, computeMethodIdOfSelection]);
  return (
    <BaseModale
      renderTitle={count =>
        upperFirst(
          t("dataImport.multiActions.actionTitles.editUnits", { count })
        )
      }
      icon={<i className="fas fa-wrench"></i>}
      renderControls={
        <>
          <div>
            <div className={styles.label}>
              {upperFirst(t("dataImport.fields.input1Unit"))}
            </div>
            <div className={styles.inputGroup}>
              <div className={cx("default-field", styles.defaultField)}>
                <SelfControlledInput
                  className={cx("field", styles.noRightBorder)}
                  value={input1Unit}
                  onHtmlChange={setInput1Unit}
                  placeholder={t("dataImport.fields.input1Unit")}
                />
              </div>
              <Tooltip
                content={upperFirst(t("dataImport.userFeedback.unitButton"))}
                hideDelay={0}
                showDelay={0}
              >
                <button
                  className={cx("button-1", styles.unitButton)}
                  onClick={() => setInput1Unit(correctInput1Unit ?? "")}
                >
                  <i className="far fa-edit"></i>
                </button>
              </Tooltip>
            </div>
          </div>
          <div>
            <div className={styles.label}>
              {upperFirst(t("dataImport.fields.input2Unit"))}
            </div>
            <div className={styles.inputGroup}>
              <div className={cx("default-field", styles.defaultField)}>
                <SelfControlledInput
                  className={cx("field", {
                    [styles.noRightBorder]: correctInput2Unit != null,
                  })}
                  value={input2Unit}
                  onHtmlChange={setInput2Unit}
                  placeholder={t("dataImport.fields.input2Unit")}
                />
              </div>
              {correctInput2Unit != null && (
                <Tooltip
                  content={upperFirst(t("dataImport.userFeedback.unitButton"))}
                  hideDelay={0}
                  showDelay={0}
                >
                  <button
                    className={cx("button-1", styles.unitButton)}
                    onClick={() => setInput2Unit(correctInput2Unit ?? "")}
                  >
                    <i className="far fa-edit"></i>
                  </button>
                </Tooltip>
              )}
            </div>
          </div>
        </>
      }
      onApplyButtonClick={entryDataIds =>
        isSelectionValid &&
        dispatch(
          setMultiEntryInputUnits({
            entryDataIds,
            input1Unit: previewInput1Unit,
            input2Unit: previewInput2Unit,
          })
        )
      }
      previewValues={{
        input1Unit: previewInput1Unit,
        input2Unit: previewInput2Unit,
      }}
      applyButtonLabel={upperFirst(t("global.modify"))}
    />
  );
};

export default EditAllUnitsModale;
