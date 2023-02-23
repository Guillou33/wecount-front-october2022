import useSetOnceAllCampaignInfo from '@hooks/core/reduxSetOnce/useSetOnceAllCampaignInfo';
import useSetOnceCategories from '@hooks/core/reduxSetOnce/useSetOnceCategories';

export default () => {
  useSetOnceAllCampaignInfo();
  useSetOnceCategories();
}
