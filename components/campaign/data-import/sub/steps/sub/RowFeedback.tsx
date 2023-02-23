import { t } from "i18next";
import { upperFirst } from "lodash";
import cx from "classnames";

import { ColumnName } from "@lib/core/dataImport/columnConfig";

import Tooltip from "@components/helpers/bootstrap/Tooltip";

import styles from "@styles/campaign/data-import/sub/steps/sub/rowFeedback.module.scss";

interface Props {
  errorsOnColumns: ColumnName[];
  warningsOnColumns?: ColumnName[];
}

const RowFeedback = ({ errorsOnColumns, warningsOnColumns = [] }: Props) => {
  const hasError = errorsOnColumns.length > 0;
  const hasWarning = !hasError && warningsOnColumns.length > 0;

  const errorFeedback =
    errorsOnColumns.length === 1
      ? "dataImport.userFeedback.errorOnColumn"
      : "dataImport.userFeedback.errorOnSeveralColumns";

  const warningFeedback =
    warningsOnColumns.length === 1
      ? "dataImport.userFeedback.warningOnColumn"
      : "dataImport.userFeedback.warningOnSeveralColumns";

  const feedBack = hasWarning ? warningFeedback : errorFeedback;
  const errors = hasWarning ? warningsOnColumns : errorsOnColumns;
  const errorNames = errors
    .map(columnName => upperFirst(t(columnName)))
    .join(", ");

  return !hasError && !hasWarning ? null : (
    <Tooltip
      content={upperFirst(t(feedBack, { value: errorNames }))}
      hideDelay={0}
      showDelay={0}
    >
      <i
        className={cx(
          "fas fa-exclamation-triangle",
          styles.icon,
          { [styles.isError]: hasError },
          { [styles.isWarning]: hasWarning }
        )}
      ></i>
    </Tooltip>
  );
};

export default RowFeedback;
