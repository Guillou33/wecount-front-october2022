import { TableVirtuoso } from "react-virtuoso";
import { t } from "i18next";

import { EntryData } from "@reducers/dataImport/entryDataReducer";

import styles from "@styles/campaign/data-import/sub/steps/sub/entryDataTable.module.scss";

interface Props {
  entryDataList: EntryData[];
  renderEntryData: (entryData: EntryData) => React.ReactNode;
  tableHeader: JSX.Element;
  scroller: React.ReactNode;
}

const EntryDataTable = ({
  entryDataList,
  renderEntryData,
  tableHeader,
  scroller,
}: Props) => {
  return (
    <>
      <p className={styles.numberOfData}>
        {entryDataList.length} {t("dataImport.common.data")}
      </p>
      <TableVirtuoso
        className={styles.entryDataTable}
        fixedHeaderContent={() => tableHeader}
        useWindowScroll
        data={entryDataList}
        itemContent={(_, entryData) => renderEntryData(entryData)}
      />
      {scroller}
    </>
  );
};

export default EntryDataTable;
