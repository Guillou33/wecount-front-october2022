import { Status, DEFAULT_STATUS } from "@custom-types/core/Status";
import styles from "@styles/campaign/detail/activity/activityEntries.module.scss";
import StatusBadge from "@components/core/StatusBadge";
import { SelectOne, Option } from "@components/helpers/ui/selects";

const selectableStatuses = [
  Status.IN_PROGRESS,
  Status.TO_VALIDATE,
  Status.TERMINATED,
];

interface Props {
  status: Status;
  save: Function;
  showStatusText: boolean;
  className?: string;
  disabled?: boolean;
}

const ActivityEntryStatus = ({
  status,
  save,
  className,
  disabled = false,
}: Props) => {
  return (
    <div className={styles.entryStatus}>
      <SelectOne
        selected={status}
        onOptionClick={status => save({ status })}
        className={className}
        placeholder={
          <StatusBadge
            status={Status.IN_PROGRESS}
            className={styles.statusBadge}
          />
        }
        disabled={disabled}
      >
        {ctx => (
          <>
            {selectableStatuses.map((status: any) => (
              <Option {...ctx} value={status} key={status}>
                <StatusBadge
                  status={status ?? DEFAULT_STATUS}
                  className={styles.statusBadge}
                />
              </Option>
            ))}
          </>
        )}
      </SelectOne>
    </div>
  );
};

export default ActivityEntryStatus;
