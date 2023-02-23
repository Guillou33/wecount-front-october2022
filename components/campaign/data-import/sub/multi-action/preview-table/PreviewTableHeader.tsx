import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import { useSelector } from "react-redux";
import cx from "classnames";

import selectVisibleColumns from "@selectors/dataImport/selectVisibleColumns";
import selectCartographyAssociationColumns from "@selectors/dataImport/selectCartographyAssociationColumns";

import useMultiActionModaleContext from "@components/campaign/data-import/sub/multi-action/hooks/useMultiActionModaleContext";

import styles from "@styles/campaign/data-import/sub/multi-actions/preview-table/previewTableHeader.module.scss";

interface Props {
  isSticked: boolean;
}

const PreviewTableHeader = ({ isSticked }: Props) => {
  const { fromStep } = useMultiActionModaleContext();

  const columnsSelector =
    fromStep === "cartography-association"
      ? selectCartographyAssociationColumns
      : selectVisibleColumns;
  const columns = useSelector(columnsSelector);

  return (
    <tr>
      {columns.map(column => (
        <th
          className={cx(styles.headerCell, { [styles.shadowed]: isSticked })}
        >
          {upperFirst(t(column.name))}
        </th>
      ))}
    </tr>
  );
};

export default PreviewTableHeader;
