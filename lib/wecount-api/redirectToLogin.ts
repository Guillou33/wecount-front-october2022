import { ServerResponse } from "http";
import Router from 'next/router';

const redirectToLogin = (res?: ServerResponse) => {
  const login = "/login?redirected=true";
  if (typeof window === "undefined") {
    if (!res) {
      return;
    }
    if (!res.writableEnded) {
      res.writeHead(302, {
        Location: login,
      });
      res.end();
    }
  } else {
    if (Router.pathname !== 'login') {
      Router.push(login);
    }
  }
}

export default redirectToLogin;
