import log4js from 'log4js'

log4js.configure({
  appenders: {
    stdout: { type: 'stdout' },
    file: { type: 'file', filename: 'logs/server.log' },
    stdoutFilter: {
      type: 'logLevelFilter', appender: 'stdout', level: 'all'
    },
    fileFilter: {
      type: 'logLevelFilter', appender: 'file', level: 'all'
    }
  },
  categories: {
    default: {
      appenders: ['stdoutFilter', 'fileFilter'], level: 'all'
    }
  }
})

export default log4js.getLogger('Server')
