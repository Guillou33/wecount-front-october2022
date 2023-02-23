import useActivityModelInfo, {
  ActivityModelWithCategory,
  ActivityModelInfo,
} from "@hooks/core/useActivityModelInfo";
import _ from "lodash";

export type ActivityModelInfoByUniqueName = {
  [key: string]: ActivityModelWithCategory;
};

const getActivityModelInfoByUniqueName = _.memoize(
  (activityModelInfo: ActivityModelInfo) =>
    Object.values(activityModelInfo).reduce(
      (
        acc: ActivityModelInfoByUniqueName,
        activityModelInfo: ActivityModelWithCategory
      ) => {
        acc[activityModelInfo.uniqueName] = activityModelInfo;
        return acc;
      },
      {}
    )
);

function useActivityModelInfoByUniqueName(): ActivityModelInfoByUniqueName {
  const activityModelInfo = useActivityModelInfo();

  return getActivityModelInfoByUniqueName(activityModelInfo);
}

export default useActivityModelInfoByUniqueName;
