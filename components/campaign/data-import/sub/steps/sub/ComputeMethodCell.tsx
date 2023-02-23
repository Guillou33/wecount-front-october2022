import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { t } from "i18next";
import { upperFirst } from "lodash";

import { RootState } from "@reducers/index";
import { ComputeMethodType } from "@custom-types/core/ComputeMethodType";
import {
  ComputeMethod,
  getComputeMethodValue,
  isNonStandardType,
} from "@lib/core/dataImport/computeMethod";

import { getComputeMethodsWithEfIfNeeded } from "@actions/core/emissionFactor/emissionFactorActions";
import { setComputeMethod } from "@actions/dataImport/entryData/entryDataActions";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import Spinner from "@components/helpers/ui/Spinner";
import MappingSelectionContainer from "./MappingSelectionContainer";

import styles from "@styles/campaign/data-import/sub/steps/sub/computeMethodCell.module.scss";

interface Props {
  activityModelId: number;
  entryDataId: string;
  computeMethod: ComputeMethod | null;
}

const ComputeMethodCell = ({
  activityModelId,
  entryDataId,
  computeMethod,
}: Props) => {
  const dispatch = useDispatch();

  const computeMethods = useSelector(
    (state: RootState) => state.core.emissionFactor.mapping[activityModelId]
  );

  const [isTooltipShown, setTooltipShown] = useState(false);

  const computeMethodValue = getComputeMethodValue(computeMethod);

  return (
    <td
      onClick={() => dispatch(getComputeMethodsWithEfIfNeeded(activityModelId))}
      onMouseEnter={() => setTooltipShown(true)}
      onMouseLeave={() => setTooltipShown(false)}
      className={styles.computeMethodCell}
    >
      <SelectOne
        selected={computeMethodValue}
        onOptionClick={value => {
          setTooltipShown(false);
          if (isNonStandardType(value)) {
            dispatch(
              setComputeMethod({
                entryDataIds: [entryDataId],
                computeMethod: { type: value },
              })
            );
          } else {
            dispatch(
              setComputeMethod({
                entryDataIds: [entryDataId],
                computeMethod: {
                  type: ComputeMethodType.STANDARD,
                  id: Number(value),
                  name: computeMethods[Number(value)].name
                },
              })
            );
          }
        }}
        renderSelectionContainer={ctx => {
          return (
            <MappingSelectionContainer
              ctx={ctx}
              status={computeMethod === null ? "error" : "ok"}
              isTooltipShown={isTooltipShown}
              mappingFailed={false}
              tooltipContent={
                computeMethod === null
                  ? upperFirst(
                      t("dataImport.userFeedback.computeMethodRequired")
                    )
                  : null
              }
              triedInput={null}
            />
          );
        }}
      >
        {ctx =>
          computeMethods != null ? (
            <>
              {Object.values(computeMethods).map(computeMethod => (
                <Option
                  {...ctx}
                  key={computeMethod.id}
                  value={computeMethod.id.toString()}
                >
                  {computeMethod.name}
                </Option>
              ))}
              <Option {...ctx} value={ComputeMethodType.RAW_DATA}>
                {upperFirst(t("entry.computeMethod.insertRawData"))}
              </Option>
            </>
          ) : (
            <Spinner
              className={styles.spinnerContainer}
              spinnerClassName={styles.spinner}
            >
              {upperFirst(t("dataImport.common.loading"))}
            </Spinner>
          )
        }
      </SelectOne>
    </td>
  );
};

export default ComputeMethodCell;
