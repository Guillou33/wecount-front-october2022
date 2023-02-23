import { ServerResponse } from "http";
import Router from 'next/router';

const redirectFromAnywhere = (path: string, as?: string, res?: ServerResponse) => {
  if (res) {
    if (!res.writableEnded) {
      res.writeHead(302, {
        Location: as ?? path,
      });
      res.end();
    }
  } else {
    Router.push(path, as);
  }
}

export default redirectFromAnywhere;
