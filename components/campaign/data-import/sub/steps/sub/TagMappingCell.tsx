import { useState } from "react";
import { t } from "i18next";
import { upperFirst } from "lodash";

import {
  MappableData,
  isMappingFailed,
  isMappingPartiallyFailed,
} from "@lib/core/dataImport/mappableData";

import MappingSelectionContainer from "./MappingSelectionContainer";
import Highlight from "@components/helpers/Highlight";
import { MultiSelect, CheckboxOption } from "@components/helpers/ui/selects";

interface Props {
  data: MappableData<number[]>;
  possibleValues: { id: number; label: string }[];
  onChange: (value: number, name: string) => void;
}

const TagMappingCell = ({ data, possibleValues, onChange }: Props) => {
  const allMappingsFailed = isMappingFailed(data);
  const someMappingFailed = isMappingPartiallyFailed(data);

  function getTooltipMessage() {
    const baseMessage = upperFirst(
      t("dataImport.userFeedback.valueFromFile", { value: data.triedInput })
    );

    if (allMappingsFailed) {
      return `${upperFirst(
        t("dataImport.userFeedback.noTagsFound")
      )}\n${baseMessage}`;
    }
    if (someMappingFailed) {
      return `${upperFirst(
        t("dataImport.userFeedback.someTagsNotFound")
      )}\n${baseMessage}`;
    }
    if (data.triedInput == null) {
      return upperFirst(t("dataImport.userFeedback.noValue"));
    }
    return baseMessage;
  }

  const isLongList = possibleValues.length > 10;

  const [isTooltipShown, setTooltipShown] = useState(false);
  const [searchedTag, setSearchedTag] = useState("");

  const isFiltered = isLongList && searchedTag !== "";

  const tagsToRender = isFiltered
    ? possibleValues.filter(tag =>
        tag.label.toLowerCase().includes(searchedTag.toLowerCase())
      )
    : possibleValues;

  const selectedTags = possibleValues.filter(
    tag => data.value?.includes(tag.id) ?? tag.id === -1
  );

  function getStatus() {
    if (allMappingsFailed) {
      return "error";
    }
    if (someMappingFailed) {
      return "warning";
    }
    return "ok";
  }

  return (
    <td
      onMouseEnter={() => setTooltipShown(true)}
      onMouseLeave={() => setTooltipShown(false)}
    >
      <MultiSelect
        selected={data.value ?? [-1]}
        onOptionClick={value => {
          const tagName =
            possibleValues.find(tag => tag.id === value)?.label ?? "";
          onChange(value, tagName);
        }}
        renderSelectionContainer={ctx => (
          <MappingSelectionContainer
            tooltipContent={getTooltipMessage()}
            ctx={ctx}
            status={getStatus()}
            isTooltipShown={isTooltipShown}
            mappingFailed={isMappingFailed(data)}
            triedInput={data.triedInput}
            searchModeOn={isLongList}
            searchedValue={searchedTag}
            setSearchedValue={setSearchedTag}
            selectedLabel={selectedTags.map(tag => tag.label).join(", ")}
          />
        )}
      >
        {ctx => (
          <>
            {tagsToRender.map(({ id, label }) => (
              <CheckboxOption {...ctx} value={id} key={id}>
                {isFiltered ? (
                  <Highlight search={searchedTag}>{label}</Highlight>
                ) : (
                  label
                )}
              </CheckboxOption>
            ))}
            {tagsToRender.length === 0 && (
              <div className="font-italic font-weight-light ml-2">
                {upperFirst(t("global.noResult"))}
              </div>
            )}
          </>
        )}
      </MultiSelect>
    </td>
  );
};

export default TagMappingCell;
