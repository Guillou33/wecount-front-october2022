// https://github.com/zeit/next.js/blob/canary/examples/with-env-from-next-config-js/next.config.js
require('dotenv').config()

const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD,
} = require('next/constants')

// This uses phases as outlined here: https://nextjs.org/docs/#custom-configuration
module.exports = phase => {
  // when started in development mode `next dev` or `npm run dev` regardless of the value of STAGING environmental variable
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  // when `next build` or `npm run build` is used
  const isProd = phase === PHASE_PRODUCTION_BUILD && process.env.STAGING !== '1'
  // when `next build` or `npm run build` is used
  const isStaging =
    phase === PHASE_PRODUCTION_BUILD && process.env.STAGING === '1'

  // console.log(`isDev:${isDev}  isProd:${isProd}   isStaging:${isStaging}`)

  const env = {
    TEST_VAR: (() => {
      if (isDev) return 'dev_val'
      if (isProd) {
        return 'prod_val'
      }
      if (isStaging) return 'staging_val'
      return 'TEST_VAR:not (isDev,isProd && !isStaging,isProd && isStaging)'
    })(),
    API_URL: process.env.API_URL,
    SENTRY_URL: process.env.SENTRY_URL,
  }

  // next.config.js object
  return {
    env,
  }
}