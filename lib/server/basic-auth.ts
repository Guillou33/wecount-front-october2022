import auth from 'basic-auth';
import { Request, Response, NextFunction } from 'express';

const admin = { name: 'wecount', password: process.env.BASIC_AUTH_PASS }

export default (request: Request, response: Response, next: NextFunction) => {
  var user = auth(request)
  
  if (!user || admin.name !== user.name || admin.password !== user.pass) {
    response.set('WWW-Authenticate', 'Basic realm="example"')
    return response.status(401).send()
  }
  return next()
};