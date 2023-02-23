import upperFirst from "lodash/upperFirst";
import { t } from "i18next";
import cx from "classnames";

import {
  MappableData,
  isMappingFailed,
} from "@lib/core/dataImport/mappableData";

import Tooltip from "@components/helpers/bootstrap/Tooltip";

import styles from "@styles/campaign/data-import/sub/multi-actions/preview-table/mappableCellPreview.module.scss";

interface Props {
  preview: string | undefined;
  data: MappableData;
  possibleValues: { [id: number]: { name: string } };
}

const MappableCellPreview = ({ preview, data, possibleValues }: Props) => {
  const mappingFailed = isMappingFailed(data);
  const hasError = mappingFailed && preview == null;

  function getPreviewValue() {
    if (preview != null) {
      return preview;
    }
    if (mappingFailed) {
      return data.triedInput;
    }
    return possibleValues[data.value ?? -1]?.name ?? data.triedInput;
  }

  return (
    <td
      className={cx(styles.mappableCellPreview, {
        [styles.hasError]: hasError,
      })}
    >
      <Tooltip
        content={
          hasError
            ? upperFirst(
                t("dataImport.userFeedback.failedMapping", {
                  value: data.triedInput,
                })
              )
            : null
        }
        showDelay={0}
        hideDelay={0}
      >
        <span>{getPreviewValue()}</span>
      </Tooltip>
    </td>
  );
};

export default MappableCellPreview;
