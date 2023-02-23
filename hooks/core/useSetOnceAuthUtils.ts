import useSetOnceProfileInfo from '@hooks/core/reduxSetOnce/useSetOnceProfileInfo';
import useSetOnceAuthInfo from '@hooks/core/reduxSetOnce/useSetOnceAuthInfo';

const useSetOnceAuthUtils = () => {
  useSetOnceProfileInfo();
  useSetOnceAuthInfo();
}

export default useSetOnceAuthUtils;
