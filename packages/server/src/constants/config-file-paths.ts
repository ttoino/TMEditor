export const CONFIG_PATH = process.env.CONFIG_PATH || '../../config'
export const BLUEPRINTS_PAGE = `${CONFIG_PATH}/blueprints/pages/`
export const BLUEPRINTS_ENTRY_POINT = (extension: string) => `${CONFIG_PATH}/blueprints/site.${extension}`
export const UI_PAGE_CONFIG_FILE =
    (pageName: string) =>
      (extension: string) => `${CONFIG_PATH}/blueprints/pages/${pageName}.${extension}`
export const DASHBOARD_ENTRY_POINT = (extension: string) => `${CONFIG_PATH}/blueprints/dashboard.${extension}`
export const REDUCERS_PATH = `${CONFIG_PATH}/reducers/`
export const CONFIG_COHORTS_PATH = (extension: string) => `${CONFIG_PATH}/cohorts.${extension}`
export const AUTH_CONFIG_FILE = (extension: string) => `${CONFIG_PATH}/auth/auth.${extension}`
