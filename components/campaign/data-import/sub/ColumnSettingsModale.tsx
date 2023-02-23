import { t } from "i18next";
import upperFirst from "lodash/upperFirst";
import debounce from "lodash/debounce";
import { useSelector, useDispatch } from "react-redux";
import cx from "classnames";

import { RootState } from "@reducers/index";
import {
  EntryDataKey,
  columnsAllowedToBeHidden,
} from "@lib/core/dataImport/columnConfig";

import {
  setColumns,
  toggleColumnVisibility,
} from "@actions/dataImport/tableSettings/tableSettingsAction";

import useDisableBodyScroll from "@hooks/utils/useDisableBodyScroll";
import DragToReorder from "@components/helpers/DragToReorder";
import CheckboxInput from "@components/helpers/ui/CheckboxInput";

import styles from "@styles/campaign/data-import/sub/columnSettingsModale.module.scss";

interface Props {
  onClose: () => void;
  ignoredColumns?: EntryDataKey[];
}

const ColumnSettingsModale = ({ onClose, ignoredColumns = [] }: Props) => {
  const dispatch = useDispatch();
  useDisableBodyScroll();

  const columns = useSelector(
    (state: RootState) => state.dataImport.tableSettings.columns
  );

  return (
    <section className={styles.columnSettingsModale}>
      <header className={styles.header}>
        <button className={styles.closeButton} onClick={onClose}>
          <i className="fa fa-times"></i>
        </button>
        <h3 className={styles.title}>
          {upperFirst(t("dataImport.columnSettingsModale.title"))}
        </h3>
      </header>
      <p className={styles.infos}>
        {upperFirst(t("dataImport.columnSettingsModale.infos"))}
      </p>
      <DragToReorder
        itemsData={columns}
        onOrderChange={debounce(columnOrder => {
          dispatch(setColumns(columnOrder));
        })}
        renderItem={item => {
          const isIgnoredColumn = ignoredColumns.includes(item.entryDataKey);
          const canBeHidden = columnsAllowedToBeHidden[item.entryDataKey];
          return (
            <div className={cx(styles.columnSetting, {})}>
              <CheckboxInput
                checked={!isIgnoredColumn && item.isVisible}
                disabled={isIgnoredColumn || !canBeHidden}
                id={item.entryDataKey}
                onChange={() => {
                  if (canBeHidden) {
                    dispatch(
                      toggleColumnVisibility({
                        entryDataKey: item.entryDataKey,
                        ignoredColumns,
                      })
                    );
                  }
                }}
              >
                {upperFirst(t(item.name))}
              </CheckboxInput>
              <div className={styles.dragIcon}>
                <i className="fa fa-ellipsis-v"></i>
                <i className="fa fa-ellipsis-v"></i>
              </div>
            </div>
          );
        }}
        keyProducer={item => item.entryDataKey}
      />
    </section>
  );
};

export default ColumnSettingsModale;
