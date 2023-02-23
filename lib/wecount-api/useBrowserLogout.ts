import Cookies from 'js-cookie';
import {
  COOKIE_AUTH_TOKEN_KEY,
  COOKIE_REFRESH_TOKEN_KEY,
} from '@lib/wecount-api/AbstractAuthTokenManager';
import { logout } from '@actions/auth/authActions'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

const useBrowserLogout = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    Cookies.remove(COOKIE_AUTH_TOKEN_KEY);
    Cookies.remove(COOKIE_REFRESH_TOKEN_KEY);
    dispatch(logout());
  }, [])
}

export default useBrowserLogout;
