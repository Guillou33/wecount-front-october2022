import cx from "classnames";

import { SelectionContainer } from "@components/helpers/ui/selects";
import SearchContainer from "@components/helpers/ui/selects/selectionContainers/SearchContainer";
import Tooltip from "@components/helpers/bootstrap/Tooltip";
import { SelectionContainerContext } from "@components/helpers/ui/selects/selectionContainers/DefaultContainer";

import styles from "@styles/campaign/data-import/sub/steps/sub/mappingSelectionContainer.module.scss";

interface Props {
  ctx: SelectionContainerContext;
  tooltipContent: string | null;
  isTooltipShown: boolean;
  status?: "ok" | "error" | "warning";
  mappingFailed: boolean;
  triedInput: string | null;
  selectedLabel?: string;
  searchModeOn?: boolean;
  searchedValue?: string;
  setSearchedValue?: (searched: string) => void;
}

const MappingSelectionContainer = ({
  ctx,
  tooltipContent,
  isTooltipShown,
  mappingFailed,
  triedInput,
  selectedLabel,
  status = "ok",
  searchModeOn = false,
  searchedValue = "",
  setSearchedValue = () => {},
}: Props) => {
  const allClassNames = cx(styles.cell, {
    [styles.cellError]: status === "error",
    [styles.cellWarning]: status === "warning",
    [styles.opened]: ctx.opened,
  });
  const displayedLabel = mappingFailed
    ? triedInput
    : selectedLabel ?? ctx.children;

  return (
    <Tooltip
      content={tooltipContent}
      hideDelay={0}
      showDelay={0}
      show={isTooltipShown}
    >
      <div className={styles.mappingSelectionContainer}>
        {searchModeOn ? (
          <SearchContainer
            {...ctx}
            searchedValue={searchedValue}
            setSearchedValue={setSearchedValue}
            className={allClassNames}
            placeholderClassName={styles.placeholder}
            searchInputClassName={styles.searchInput}
          >
            {displayedLabel}
          </SearchContainer>
        ) : (
          <SelectionContainer
            {...ctx}
            className={allClassNames}
            placeholderClassName={styles.placeholder}
          >
            {displayedLabel}
          </SelectionContainer>
        )}
      </div>
    </Tooltip>
  );
};

export default MappingSelectionContainer;
