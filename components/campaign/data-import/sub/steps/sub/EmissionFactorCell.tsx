import { useState } from "react";
import cx from "classnames";
import { useSelector } from "react-redux";
import { t } from "i18next";
import { upperFirst } from "lodash";

import { RootState } from "@reducers/index";

import {
  ComputeMethod,
  isNonStandard,
  isStandard,
} from "@lib/core/dataImport/computeMethod";

import PrivateBadge from "@components/core/PrivateBadge";
import { SelectOne, Option } from "@components/helpers/ui/selects";
import MappingSelectionContainer from "./MappingSelectionContainer";

import styles from "@styles/campaign/data-import/sub/steps/sub/emissionFactorCell.module.scss";

interface Props {
  emissionFactorId: number | null;
  activitymodelId: number;
  computeMethod: ComputeMethod | null;
  onChange: (value: number, name: string) => void;
}

const EmissionFactorCell = ({
  computeMethod,
  activitymodelId,
  emissionFactorId,
  onChange,
}: Props) => {
  const emissionFactorMappings = useSelector((state: RootState) => {
    if (computeMethod == null || isNonStandard(computeMethod)) {
      return [];
    }
    return (
      state.core.emissionFactor.mapping[activitymodelId]?.[computeMethod.id]
        ?.emissionFactorMappings ?? []
    );
  });

  const [isTooltipShown, setTooltipShown] = useState(false);

  const isDisabled = computeMethod == null || isNonStandard(computeMethod);
  const hasError =
    computeMethod != null &&
    isStandard(computeMethod) &&
    emissionFactorId == null;

  return (
    <td
      className={styles.emissionFactorCell}
      onMouseEnter={() => setTooltipShown(true)}
      onMouseLeave={() => setTooltipShown(false)}
    >
      <SelectOne
        selected={emissionFactorId}
        onOptionClick={value => {
          const emissionFactorName =
            computeMethod != null && isStandard(computeMethod)
              ? emissionFactorMappings.find(
                  efm => efm.emissionFactor.id === value
                )?.emissionFactor.name ?? ""
              : "";
          onChange(value, emissionFactorName);
          setTooltipShown(false);
        }}
        disabled={isDisabled}
        renderSelectionContainer={ctx => {
          return (
            <MappingSelectionContainer
              ctx={ctx}
              status={hasError ? "error" : "ok"}
              isTooltipShown={isTooltipShown}
              mappingFailed={false}
              tooltipContent={
                hasError
                  ? upperFirst(
                      t("dataImport.userFeedback.emissionFactorRequired")
                    )
                  : null
              }
              triedInput={null}
            />
          );
        }}
      >
        {ctx => (
          <>
            {emissionFactorMappings.map(efm => {
              const isEfDisabled =
                efm.emissionFactor.notVisible || efm.emissionFactor.archived;
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
                        className={cx(styles.infoIcon, "ml-2 fas fa-archive")}
                      ></i>
                    )}
                    {efm.emissionFactor.isPrivate && <PrivateBadge />}
                  </div>
                </Option>
              );
            })}
          </>
        )}
      </SelectOne>
    </td>
  );
};

export default EmissionFactorCell;
