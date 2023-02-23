import ApiClient from '@lib/wecount-api/ApiClient';
import { NextPageContext } from 'next';
import Head from 'next/head'
import Login from '@components/auth/Login';
import { useEffect } from 'react';
import useBrowserLogout from '@lib/wecount-api/useBrowserLogout';

const LoginPage = () => {
  useBrowserLogout();

  return (
    <>
      <Head>
        <title>Login - WeCount</title>
      </Head>
      <Login />
    </>
    
  );
};

export default LoginPage;
