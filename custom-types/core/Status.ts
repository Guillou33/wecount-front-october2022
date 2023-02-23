export enum Status {
  IN_PROGRESS = "IN_PROGRESS",
  TO_VALIDATE = "TO_VALIDATE",
  TERMINATED = "TERMINATED",
  ARCHIVED = "ARCHIVED",
};

type StatusWeights = {
  [key in Status]: number;
}
export const STATUS_WEIGHTS: StatusWeights = {
  IN_PROGRESS: 1,
  TO_VALIDATE: 2,
  TERMINATED: 3,
  ARCHIVED: 4,

}

export const DEFAULT_STATUS = Status.IN_PROGRESS;
