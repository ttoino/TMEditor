const logger = require('../../../../config/logger');

const {
  AUTHENTICATION_REQUIRED,
  SIGN_IN_SUCCESSFUL,
  SUCCESSFULLY_CONNECTED_TO_DB
} = require('../../../../utils/constants/logger-messages')

const {
  defaultDatabaseID,
} = require('../../../../utils/default-values-generator')

const fetch = require('node-fetch');

const {
  formatUserData,
  formatCardData,
  formatTableData,
  formatTimeseriesData,
  formatHistogramData,
  formatPiechartData,
  formatBarchartData,
} = require('../fhir-data-formatter');

// URL of the Hapi Server
const serverUrl = [];
const serverPort = [];
const usersTableAttributes = [];

/**
 * Saves the hapi server information for later access (and saves them in serverUrl, serverPort and nmAttributes).
 * 
 * @param config          The database details information, incoming from the yaml file
 * @param nmAttributes    The user Attributes, from the yaml file, to be presented on the dashboard table
 * @param id              The database Id to register the connection
*/
exports.hapiConnection = async (config, nmAttributes, id) => {
  serverUrl[id] = config.serverUrl;
  serverPort[id] = config.serverPort;
  usersTableAttributes[id] = nmAttributes;
}

/**
 * Requests to the Hapi server the User data and returns it formatted to the main fhir module.
 * 
 * @param dbInfo  The database info, from the yaml file.
 * @returns       The Users' data, formatted in a JSON.
 */
exports.hapiRequestUsers = async (dbInfo) => {
  const table = dbInfo.users["tables"];
  const { id } = dbInfo;

  const resources =  await requestData(table, id);

  return formatUserData(resources, usersTableAttributes[id]);
}


/**
 * Requests to the Hapi server data for a card.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for the card.
 */
exports.hapiCardData = async (dbInfo, specifications) => {
  const { tables, x, operator } = specifications;
  const { id } = dbInfo; 

  const resources = await requestData(tables, id);

  return formatCardData(resources, x, operator);
}

/**
 * Requests to the Hapi server data for a table.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for the table.
 */
exports.hapiTableData = async (dbInfo, specifications) => {
  const { tables, x } = specifications;
  const { id } = dbInfo; 

  const resources = await requestData(tables, id);

  return formatTableData(resources, x);
}

/**
 * Requests to the Hapi server data for a Timeseries chart.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for a Timeseries chart.
 */
exports.hapiTimeseriesData = async (dbInfo, specifications) => {
  const { tables, x, y } = specifications;
  const { id } = dbInfo; 

  const resources = await requestData(tables, id);
  
  return formatTimeseriesData(resources, x, y);
}

/**
 * Requests to the Hapi server data for a Histogram.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for a Histogram.
 */
exports.hapiHistogramData = async (dbInfo, specifications) => {
  const { tables, x } = specifications;
  const { id } = dbInfo; 

  const resources = await requestData(tables, id);

  return formatHistogramData(resources, x);
}

/**
 * Requests to the Hapi server data for a Pie chart.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for a Pie chart.
 */
exports.hapiPiechartData = async (dbInfo, specifications) => {
  const { tables, x } = specifications;
  const { id } = dbInfo; 
  
  const resources = await requestData(tables, id);

  return formatPiechartData(resources, x);
}

/**
 * Requests to the Hapi server data for a Bar chart.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for the Bar chart.
 */
exports.hapiBarchartData = async (dbInfo, specifications) => {
  const { tables, x } = specifications;
  const { id } = dbInfo; 

  const resources = await requestData(tables, id);

  return formatBarchartData(resources, x);
}


// Hapi  Utilities ---------------------------------------------------------------------------------------------------------------

const requestData = async (table, id) => {
  let data;

  try {
    data = await fetch(`${serverUrl[id]}:${serverPort[id]}/fhir/${table}?`);
  } catch (err) {
    console.log(err);
  }

  const resources = await data.json();

  return resources.entry;
}