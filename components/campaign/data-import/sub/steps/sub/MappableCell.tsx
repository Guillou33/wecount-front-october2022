import { useState } from "react";
import { t } from "i18next";
import { upperFirst } from "lodash";

import {
  MappableData,
  isMappingFailed,
} from "@lib/core/dataImport/mappableData";

import { SelectOne, Option } from "@components/helpers/ui/selects";
import Highlight from "@components/helpers/Highlight";
import MappingSelectionContainer from "./MappingSelectionContainer";

interface Props {
  data: MappableData;
  possibleValues: { id: number; label: string }[];
  disabledMessage?: string;
  allowNull?: boolean;
  onChange: (value: number, entityName: string) => void;
}

const MappableCell = ({
  data,
  possibleValues,
  onChange,
  allowNull = false,
  disabledMessage,
}: Props) => {
  const mappingFailed = isMappingFailed(data);
  const isDisabled = possibleValues.length === 0;

  const hasError =
    mappingFailed || (data.value == null && !allowNull && !isDisabled);

  function getTooltipMessage() {
    if (mappingFailed) {
      return upperFirst(
        t("dataImport.userFeedback.failedMapping", { value: data.triedInput })
      );
    }
    if (isDisabled && disabledMessage != null) {
      return disabledMessage;
    }
    if (data.triedInput == null) {
      return upperFirst(t("dataImport.userFeedback.noValue"));
    }
    return upperFirst(
      t("dataImport.userFeedback.valueFromFile", { value: data.triedInput })
    );
  }

  const [isTooltipShown, setTooltipShown] = useState(false);
  const [searchedValue, setSearchedValue] = useState("");

  const isLongList = possibleValues.length > 10;
  const isListFiltered = isLongList && searchedValue !== "";

  const optionsToRender = isListFiltered
    ? possibleValues.filter(value =>
        value.label.toLowerCase().includes(searchedValue.toLowerCase())
      )
    : possibleValues;

  const selectedLabel = possibleValues.find(
    value => value.id === data.value
  )?.label;

  return (
    <td
      onMouseEnter={() => setTooltipShown(true)}
      onMouseLeave={() => setTooltipShown(false)}
    >
      <SelectOne
        selected={data.value ?? null}
        onOptionClick={id => {
          const entityName = possibleValues.find(
            value => value.id === id
          )?.label ?? "";
          onChange(id, entityName);
          setTooltipShown(false);
        }}
        disabled={isDisabled}
        renderSelectionContainer={ctx => {
          return (
            <MappingSelectionContainer
              ctx={ctx}
              status={hasError ? "error" : "ok"}
              isTooltipShown={isTooltipShown}
              mappingFailed={mappingFailed}
              tooltipContent={getTooltipMessage()}
              triedInput={data.triedInput}
              searchModeOn={isLongList}
              searchedValue={searchedValue}
              setSearchedValue={setSearchedValue}
              selectedLabel={selectedLabel}
            />
          );
        }}
      >
        {ctx => (
          <>
            {optionsToRender.map(value => (
              <Option
                {...ctx}
                value={value.id}
                key={value.id}
                isSelected={value.id === data.value}
              >
                {isListFiltered ? (
                  <Highlight search={searchedValue}>{value.label}</Highlight>
                ) : (
                  value.label
                )}
              </Option>
            ))}
            {optionsToRender.length === 0 && (
              <div className="font-italic font-weight-light ml-2">
                {upperFirst(t("global.noResult"))}
              </div>
            )}
          </>
        )}
      </SelectOne>
    </td>
  );
};

export default MappableCell;
