import log4js from 'log4js'

const apiCallsLayout = {
  type: 'pattern',
  pattern: '[%d] %m'
}

log4js.configure({
  appenders: {
    serverConsole: { type: 'stdout' },
    serverFile: { type: 'file', filename: 'logs/server.log' },
    apiCallsFile: {
      type: 'dateFile',
      pattern: 'yyyy-MM',
      filename: 'logs/api_calls.log',
      keepFileExt: true,
      alwaysIncludePattern: true,
      layout: apiCallsLayout
    }
  },
  categories: {
    default: { appenders: ['serverFile', 'serverConsole'], level: 'all' },
    api_call: { appenders: ['apiCallsFile'], level: 'all' }
  }
})

export default log4js.getLogger('Server')
