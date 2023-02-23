import { t } from "i18next";
import { useSelector } from "react-redux";
import { useState } from "react";
import upperFirst from "lodash/upperFirst";

import { RootState } from "@reducers/index";
import { EntryTagList } from "@reducers/core/entryTagReducer";

import { MultiSelect, CheckboxOption } from "@components/helpers/ui/selects";
import {
  DefaultContainer,
  SearchContainer,
} from "@components/helpers/ui/selects/selectionContainers";
import { AiOutlineTag } from "react-icons/ai";
import Highlight from "@components/helpers/Highlight";

import styles from "@styles/core/tagMultiSelect.module.scss";

interface Props {
  selectedTagIds: number[];
  disabled?: boolean;
  onChange: (selectedTagIds: number[]) => void;
}

const TagMultiSelect = ({
  selectedTagIds,
  disabled = false,
  onChange,
}: Props) => {
  const entryTagList = useSelector<RootState, EntryTagList>(
    state => state.core.entryTag.entryTagList
  );
  const entryTags = Object.values(entryTagList).filter(
    entryTag => entryTag.archivedDate === null
  );
  const isLongList = entryTags.length > 10;
  const [searchedTag, setSearchedTag] = useState("");
  const isListFiltered = isLongList && searchedTag !== "";

  const selectedEntryTags = selectedTagIds
    .map(tagId => entryTagList[tagId])
    .filter(entryTag => entryTag?.archivedDate === null);

  const tagsToRender = isListFiltered
    ? entryTags.filter(tag =>
        tag.name.toLowerCase().includes(searchedTag.toLowerCase())
      )
    : entryTags;

  const renderSelectionContent = () => {
    return (
      <>
        <AiOutlineTag className={styles.tagIcon} />
        {selectedEntryTags.length === 0 && (
          <span className={styles.placeholder}>{t("entry.unaffected")}</span>
        )}
        {selectedEntryTags.map(entryTag => (
          <span className={styles.pill} key={entryTag.id}>
            {entryTag.name}
            {!disabled && (
              <button
                className={styles.removeTagButton}
                onClick={e => {
                  e.stopPropagation();
                  const newSelectedTagList = selectedEntryTags
                    .filter(tag => tag.id !== entryTag.id)
                    .map(tag => tag.id);

                  onChange(newSelectedTagList);
                }}
              >
                <i className="fa fa-times" />
              </button>
            )}
          </span>
        ))}
      </>
    );
  };
  return (
    <MultiSelect
      selected={selectedTagIds}
      onOptionClick={tagId => {
        const entryTagIds = selectedTagIds.includes(tagId)
          ? selectedTagIds.filter(id => id !== tagId)
          : [...selectedTagIds, tagId];
        onChange(entryTagIds);
      }}
      className={styles.tagSelector}
      disabled={disabled}
      renderSelectionContainer={ctx => {
        return isLongList ? (
          <SearchContainer
            {...ctx}
            searchedValue={searchedTag}
            setSearchedValue={setSearchedTag}
          >
            {renderSelectionContent()}
          </SearchContainer>
        ) : (
          <DefaultContainer {...ctx}>
            {renderSelectionContent()}
          </DefaultContainer>
        );
      }}
    >
      {ctx => (
        <>
          {tagsToRender.map(tag => (
            <CheckboxOption {...ctx} key={tag.id} value={tag.id}>
              {isListFiltered ? (
                <Highlight search={searchedTag}>{tag.name}</Highlight>
              ) : (
                tag.name
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
  );
};

export default TagMultiSelect;
