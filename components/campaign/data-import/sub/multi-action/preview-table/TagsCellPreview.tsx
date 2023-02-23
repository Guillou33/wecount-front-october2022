import upperFirst from "lodash/upperFirst";
import { t } from "i18next";

import cx from "classnames";

import {
  MappableData,
  isMappingFailed,
  isMappingPartiallyFailed,
} from "@lib/core/dataImport/mappableData";

import Tooltip from "@components/helpers/bootstrap/Tooltip";

import styles from "@styles/campaign/data-import/sub/multi-actions/preview-table/mappableCellPreview.module.scss";

interface Props {
  preview: string | undefined;
  data: MappableData<number[]>;
  possibleValues: { [id: number]: { name: string } };
}

const TagsCellPreview = ({ data, possibleValues, preview }: Props) => {
  const mappingFailed = isMappingFailed(data);
  const partiallyFailed = isMappingPartiallyFailed(data);
  const hasError = (mappingFailed || partiallyFailed) && preview == null;

  function getPreviewValue() {
    if (preview != null) {
      return preview;
    }
    if (mappingFailed) {
      return data.triedInput;
    }
    return data.value
      ?.reduce((acc: string[], tag) => {
        if (possibleValues[tag] != null) {
          acc.push(possibleValues[tag].name);
        }
        return acc;
      }, [])
      .join(", ");
  }

  function getTooltipMessage() {
    const baseMessage = upperFirst(
      t("dataImport.userFeedback.valueFromFile", { value: data.triedInput })
    );

    if (mappingFailed) {
      return `${upperFirst(
        t("dataImport.userFeedback.noTagsFound")
      )}\n${baseMessage}`;
    }
    if (partiallyFailed) {
      return `${upperFirst(
        t("dataImport.userFeedback.someTagsNotFound")
      )}\n${baseMessage}`;
    }
    return null;
  }

  return (
    <td
      className={cx(styles.mappableCellPreview, {
        [styles.hasError]: hasError,
      })}
    >
      <Tooltip
        content={hasError ? getTooltipMessage() : null}
        showDelay={0}
        hideDelay={0}
      >
        <span>{getPreviewValue()}</span>
      </Tooltip>
    </td>
  );
};

export default TagsCellPreview;
