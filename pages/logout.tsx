import { useEffect } from 'react';
import redirectToLogin from '@lib/wecount-api/redirectToLogin';
import useBrowserLogout from '@lib/wecount-api/useBrowserLogout';

const LogoutPage = () => {
  useBrowserLogout();
  useEffect(() => {
    redirectToLogin();
  }, []);


  return null;
};


export default LogoutPage;
