import { percentageCalculator } from "@lib/utils/calculator";
import { Status } from "@custom-types/core/Status";

type StatusesCount = {
  [key in Status]: number;
};
export type StatusesCountWithTotal = StatusesCount & {
  total: number;
};

const defaultStatusesCount = (): StatusesCount => ({
  [Status.IN_PROGRESS]: 0,
  [Status.TO_VALIDATE]: 0,
  [Status.TERMINATED]: 0,
  [Status.ARCHIVED]: 0,
});

const defaultCount = (): StatusesCountWithTotal => ({
  ...defaultStatusesCount(),
  total: 0,
});

export function getStatusesCount(
  statusList: Status[]
): StatusesCountWithTotal {
  return statusList
    .reduce((count, status) => {
      count[status]++;
      count.total++;
      return count;
    }, defaultCount());
}

export function getStatusesPercentageFromStatusesCount(
  statusesCount: StatusesCountWithTotal
): StatusesCountWithTotal {
  const { total, ...statuses } = statusesCount;
  const percentageOfEntries = percentageCalculator(statusesCount.total);
  const statusesPercentages: StatusesCount = defaultStatusesCount();
  for (const status in statuses) {
    statusesPercentages[status as Status] = percentageOfEntries(
      statuses[status as Status]
    );
  }
  return { ...statusesPercentages, total };
}
