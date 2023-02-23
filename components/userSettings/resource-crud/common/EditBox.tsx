import cx from "classnames";
import styles from "@styles/userSettings/common/editBox.module.scss";
import nl2br from "react-nl2br";
import { formatNumberWithLanguage } from "@lib/translation/config/numbers";
import { upperFirst } from "lodash";
import { t } from "i18next";

interface Props {
  title: string;
  description: string | null;
  quantity?: number | undefined;
  subTitle?: string;
  isArchived: boolean;
  archiveClassName?: string;
  onArchiveClick?: () => void;
  onUnarchiveClick?: () => void;
  onEditClick?: () => void;
}

const EditBox = ({
  title,
  description,
  quantity,
  subTitle,
  isArchived,
  archiveClassName = "fa-archive",
  onArchiveClick,
  onUnarchiveClick,
  onEditClick,
}: Props) => {
  return (
    <div className={cx(styles.main, { [styles.archived]: isArchived })}>
      <div className={cx(styles.info)}>
        <p className={cx(styles.title, "title-3", "color-1")}>
          {title}
          {subTitle && (
            <span className={cx(styles.subTitle)}>
              - {subTitle}
            </span>
          )}
        </p>
        {quantity && (
          <p className={cx(styles.quantity)}>
            {upperFirst(t("footprint.annualVolume"))} : {formatNumberWithLanguage(quantity)}
          </p>
        )}
        {description && (
          <p className={cx(styles.description)}>{nl2br(description)}</p>
        )}
      </div>
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
    </div>
  );
};

export default EditBox;
