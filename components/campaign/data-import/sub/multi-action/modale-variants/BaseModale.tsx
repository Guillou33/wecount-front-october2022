import cx from "classnames";
import { TableVirtuoso } from "react-virtuoso";
import { useSelector } from "react-redux";
import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useState } from "react";
import throttle from "lodash/throttle";

import { EntryDataKey } from "@lib/core/dataImport/columnConfig";
import { RootState } from "@reducers/index";

import selectAllSelectedEntryData from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectAllSelectedEntryData";
import selectAllSelectedEntryDataIds from "@selectors/dataImport/entryDataSelection/selectedEntryData/selectAllSelectedEntryDataIds";

import useMultiActionModaleContext from "@components/campaign/data-import/sub/multi-action/hooks/useMultiActionModaleContext";

import PreviewTableHeader from "@components/campaign/data-import/sub/multi-action/preview-table/PreviewTableHeader";
import PreviewCartographyAssociationRow from "@components/campaign/data-import/sub/multi-action/preview-table/PreviewCartographyAssociationRow";
import PreviewCompletionRow from "@components/campaign/data-import/sub/multi-action/preview-table/PreviewCompletionRow";

import styles from "@styles/campaign/data-import/sub/multi-actions/modale-variants/baseModale.module.scss";

export type PreviewValues = Partial<Record<EntryDataKey, string>>;

interface Props {
  renderTitle: (entriesNumber: number) => string;
  icon?: JSX.Element;
  applyButtonLabel?: string;
  applyButtonClassName?: string;
  onApplyButtonClick: (entryIds: string[]) => void;
  renderControls?: JSX.Element;
  previewValues?: PreviewValues;
}

const BaseModale = ({
  renderTitle,
  icon,
  onApplyButtonClick,
  renderControls,
  applyButtonLabel = upperFirst(t("global.confirm")),
  applyButtonClassName,
  previewValues = {},
}: Props) => {

  const selectedEntries = useSelector((state: RootState) =>
    selectAllSelectedEntryData(state)
  );
  const selectedEntryIds = useSelector((state: RootState) =>
    selectAllSelectedEntryDataIds(state)
  );

  const { fromStep, onClose } = useMultiActionModaleContext();

  const [isScrolled, setIsScrolled] = useState(false);
  const handleScrollTop = throttle((scrollTop: number) => {
    setIsScrolled(scrollTop > 0);
  }, 16);

  return (
    <div className={styles.baseModale}>
      <h2 className={styles.title}>
        <span className={styles.iconContainer}>{icon != null && icon}</span>
        <span className={cx({ [styles.addMargin]: icon != null })}>
          {renderTitle(selectedEntryIds.length)}
        </span>
      </h2>
      <div className={styles.actionBar}>
        <div className={styles.controls}>{renderControls}</div>
        <div className={styles.buttons}>
          <button className="button-2" onClick={onClose}>
            {upperFirst(t("global.cancel"))}
          </button>
          <button
            className={cx("button-1", applyButtonClassName)}
            onClick={() => {
              onClose();
              onApplyButtonClick(selectedEntryIds);
            }}
          >
            {applyButtonLabel}
          </button>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <TableVirtuoso
          onScroll={e =>
            handleScrollTop((e.target as HTMLDivElement)?.scrollTop ?? 0)
          }
          className={styles.previewTable}
          fixedHeaderContent={() => (
            <PreviewTableHeader isSticked={isScrolled} />
          )}
          data={selectedEntries}
          itemContent={(_, entryData) => {
            if (fromStep === "cartography-association") {
              return (
                <PreviewCartographyAssociationRow
                  entryData={entryData}
                  previewValues={previewValues}
                />
              );
            }
            return (
              <PreviewCompletionRow
                entryData={entryData}
                previewValues={previewValues}
              />
            );
          }}
        />
      </div>
    </div>
  );
};

export default BaseModale;
