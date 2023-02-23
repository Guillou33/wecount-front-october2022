import cx from "classnames";
import nl2br from "react-nl2br";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { upperFirst } from "lodash";
import { t } from "i18next";
import styles from "@styles/userSettings/resource-crud/cef/cef.module.scss";
import CustomTooltip from "@components/helpers/bootstrap/Tooltip";

interface Props {
  title: string;
  input1Name: string | null;
  input1Unit: string | null;
  source: string | null;
  comment: string | null;
  value?: number | undefined;
  isArchived: boolean;
  archiveClassName?: string;
  onArchiveClick?: () => void;
  onUnarchiveClick?: () => void;
  onEditClick?: () => void;
}

const CefBox = ({
  title,
  source,
  comment,
  input1Name,
  input1Unit,
  value,
  isArchived,
  archiveClassName = "fa-archive",
  onArchiveClick,
  onUnarchiveClick,
  onEditClick,
}: Props) => {
  return (
    <tr className={cx(styles.line)}>
      <td>
          <strong>{title}</strong>
      </td>
      <td>
          {value ? `${formatNumberWithLanguage(value)} ${t("footprint.emission.kgco2.kgco2e")}` : "-"}
      </td>
      <td>
        {input1Name ? nl2br(input1Name) : "-"}
      </td>
      <td>
        {input1Unit ? nl2br(input1Unit) : "-"}
      </td>
      <td>
        {source ? nl2br(source) : "-"}
      </td>
      <td className={cx(styles.truncate)}>
        {comment ? (
          <CustomTooltip content={nl2br(comment)} hideDelay={0} showDelay={0}>
            <p>{nl2br(comment)}</p>
          </CustomTooltip>
        ) : "-"}
      </td>
      <td>
        <div className={cx(styles.actionButtons)}>
          {isArchived
            ? onUnarchiveClick && (
                <i
                  onClick={onUnarchiveClick}
                  className={cx(
                    "fa fa-undo",
                    styles.unarchiveIcon,
                    styles.actionIcon
                  )}
                ></i>
              )
            : onArchiveClick && (
                <i
                  onClick={onArchiveClick}
                  className={cx(
                    "fa",
                    archiveClassName,
                    styles.archiveIcon,
                    styles.actionIcon
                  )}
                ></i>
              )}
          {onEditClick && (
            <i
              onClick={onEditClick}
              className={cx("fa fa-pen", styles.editIcon, styles.actionIcon)}
            ></i>
          )}
        </div>
      </td>
    </tr>
  );
};

export default CefBox;
