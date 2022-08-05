import { Request, Response, NextFunction } from 'express'
import log4js from 'log4js'
import jwt_decode from "jwt-decode"

const logger = log4js.getLogger('api_call')

const getUser = (token?: string) => {
  let user = null
  if (token) {
    const decoded = jwt_decode(token);
    user = decoded?.preferred_username || decoded?.sub
  }
  return user || "undefined"
}

export const logApiCalls = (req: Request, res: Response, next: NextFunction) => {
  const user = getUser(req.headers.authorization)
  req.logging = new Set()
  res.on('finish', () => {
    logger.info(`<${user}> "${req.method} ${req.originalUrl}" ${res.statusCode} ${res.get('Content-Length') || 0}b '${Array.from(req.logging.values())}'`)
  })
  next()
}