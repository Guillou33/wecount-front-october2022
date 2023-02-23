import { useSelector } from "react-redux";
import { RootState } from '@reducers/index';
import { Activity } from '@reducers/campaignReducer';
import _ from 'lodash';

interface ActivitiesByModelId {
  [key: number]: Activity[]
};

const useActivitiesByModelId = (campaignId: number) => {
  const activities = useSelector<RootState, { [key: number]: Activity; } | undefined>(state => state.campaign.campaigns[campaignId]?.activities);
  
  return memoizedActivitiesByModelId(activities);
};

const getActivitiesByModelId = (activities: { [key: number]: Activity; } | undefined): ActivitiesByModelId => {

  if (!activities) {
    return {};
  }
  const activitiesByModelId = Object.values(activities).reduce((mapping: ActivitiesByModelId, activity: Activity) => {
    const modelId = activity.activityModelId;
    if (!(modelId in mapping)) {
      mapping[modelId] = [];
    }
    mapping[modelId].push(activity);
    return mapping;
  }, {})

  return activitiesByModelId;
}

const memoizedActivitiesByModelId = _.memoize(getActivitiesByModelId);

export default useActivitiesByModelId;
