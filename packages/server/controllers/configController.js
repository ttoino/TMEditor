const yamlInterpreter = require('../parsers/yaml-parser')
const uiInterpreter = require('../parsers/ui-parser')
const fs = require('fs')
const _ = require('lodash')

const logger = require('../config/logger')
const {
  ERROR_READ_PLATFORM_CONFIG,
  ERROR_READ_UI_PAGE
} = require('../utils/constants/logger-messages')
const { BLUEPRINTS_PAGE } = require('../utils/constants/config-file-paths')
const { getCacheValueByKey, storeCacheKeyValue } = require('../cache')
const { defaultAsArray } = require('../utils/default-values-generator')

const getPagesName = () => {
  var pages = []
  fs.readdirSync(BLUEPRINTS_PAGE).forEach(page => {
    var fileName = page
      .split('.')
      .slice(0, -1)
      .join('.')
    var name = yamlInterpreter.readPageName(BLUEPRINTS_PAGE, page)
    pages.push({ fileName: fileName, name: name || fileName })
  })
  return pages
}

exports.getPlatformConfig = async function (req, res) {
  getCacheValueByKey('platformMainConfig')
    .then(cachedMainConfig => {
      const mainConfig = yamlInterpreter.readPlatformMainConfig()

      if (!cachedMainConfig) {
        var mergedObj = {
          ...mainConfig,
          dashboard: yamlInterpreter.readDashboardEntryPoint(),
          usersLocation: defaultAsArray(mainConfig.usersLocation),
          pages: getPagesName()
        }
        storeCacheKeyValue('platformMainConfig', mergedObj, 0)
        res.status(200).send(mergedObj)
      } else {
        res.status(200).send(cachedMainConfig)
      }
    })
    .catch(e => {
      res.sendStatus(500)
      logger.error(ERROR_READ_PLATFORM_CONFIG)
      logger.error(e)
    })
}

exports.getUIPageConfig = function (req, res) {
  var { id, page } = req.params
  var key = id + page

  const sendErrorMessage = e => {
    res.sendStatus(500)
    logger.error(ERROR_READ_UI_PAGE(page))
    logger.error(e)
  }

  const replaceChartsWithNoDataByErrorComp = uiComponents => {
    for (var key in uiComponents) {
      var ele = uiComponents[key]
      if (!Object.prototype.hasOwnProperty.call(ele.specifications, 'data')) {
        uiComponents[key].type = 'error'
      }
    }
  }

  getCacheValueByKey(key).then(async cachedPageConfig => {
    if (!cachedPageConfig || !_.isEmpty(req.query)) {
      var pageConfig = await yamlInterpreter.readUIMetadata(page)
      var { components: uiComponents } = pageConfig

      // Include query params in page config
      pageConfig = { ...pageConfig, params: req.query }
      const params = { ...req.query, ...(id && { id }) }

      uiInterpreter
        .readUIComponents(uiComponents, params)
        .catch(error => {
          replaceChartsWithNoDataByErrorComp(uiComponents)
          logger.error(error)
        })
        .then(() => {
          storeCacheKeyValue(key, pageConfig, 300)
          res.status(200).send(pageConfig)
        })
    } else {
      res.status(200).send(cachedPageConfig)
    }
  }).catch = e => {
    sendErrorMessage(e)
  }
}
