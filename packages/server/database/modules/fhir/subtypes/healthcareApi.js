const {google} = require('googleapis');
const healthcare = google.healthcare('v1');
require('dotenv').config({path: `${__dirname}/../../../../../../config/.env`})


const logger = require('../../../../config/logger');
const {
  AUTHENTICATION_REQUIRED,
  SIGN_IN_SUCCESSFUL,
  SUCCESSFULLY_CONNECTED_TO_DB
} = require('../../../../utils/constants/logger-messages')
const {
  defaultDatabaseID,
} = require('../../../../utils/default-values-generator')

const {
  formatUserData,
  formatCardData,
  formatTableData,
  formatTimeseriesData,
  formatHistogramData,
  formatPiechartData,
  formatBarchartData,
} = require('../fhir-data-formatter');

// The data for each cloud healthcare API db, by their ID
const cloudRegion = [];
const projectId = [];
const datasetId = [];
const usersTableAttributes = [];


/**
 * Logs in to the Google API and sets the database configuration variables (cloudRegion, projectId, datasetId and usersTableAttributes).
 * 
 * @param config          The database details information, incoming from the yaml file
 * @param nmAttributes    The user Attributes, from the yaml file, to be presented on the dashboard table
 * @param id              The database Id to register the connection
*/
exports.healthcareApiLogin = async (config, nmAttributes, id) => {
  logger.info(AUTHENTICATION_REQUIRED(id));
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.KEYFILEPATH,
    scopes: ['https://www.googleapis.com/auth/cloud-platform'],
  });
  
  google.options({auth});

  logger.info(SIGN_IN_SUCCESSFUL);
  logger.info(SUCCESSFULLY_CONNECTED_TO_DB(defaultDatabaseID(id)));

  projectId[id] = config.projectId;
  cloudRegion[id] = config.cloudRegion;
  datasetId[id] = config.datasetId;
  usersTableAttributes[id] = nmAttributes;
}

/**
 * Requests to the Healthcare API the User data and returns it formatted to the main fhir module.
 * 
 * @param dbInfo  The database info, from the yaml file.
 * @returns       The Users' data, formatted in a JSON.
 */
exports.healthcareApiRequestUsers = async (dbInfo) => {
  const fhirStoreId = dbInfo.users["datastore"];
  const table = dbInfo.users["tables"];
  const { id } = dbInfo; 

  const resources = await requestData(fhirStoreId, table, id);

  return formatUserData(resources, usersTableAttributes[id]);
}

/**
 * Requests to the Healthcare API data for a card.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for the card.
 */
exports.healthcareApiCardData = async (dbInfo, specifications) => {
  const fhirStoreId = dbInfo.users["datastore"];
  const { tables, x, operator } = specifications;
  const { id } = dbInfo; 

  const resources = await requestData(fhirStoreId, tables, id);

  return formatCardData(resources, x, operator);
}

/**
 * Requests to the Healthcare API data for a table.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for the table.
 */
exports.healthcareApiTableData = async (dbInfo, specifications) => {
  const fhirStoreId = dbInfo.users["datastore"];
  const { tables, x } = specifications;
  const { id } = dbInfo; 

  const resources = await requestData(fhirStoreId, tables, id);

  return formatTableData(resources, x);
}

/**
 * Requests to the Healthcare API data for a Timeseries chart.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for a Timeseries chart.
 */
exports.healthcareApiTimeseriesData = async (dbInfo, specifications) => {
  const fhirStoreId = dbInfo.users["datastore"];
  const { tables, x, y } = specifications;
  const { id } = dbInfo; 

  const resources = await requestData(fhirStoreId, tables, id);
  
  return formatTimeseriesData(resources, x, y);
}

/**
 * Requests to the Healthcare API data for a Histogram.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for a Histogram.
 */
exports.healthcareApiHistogramData = async (dbInfo, specifications) => {
  const fhirStoreId = dbInfo.users["datastore"];
  const { tables, x } = specifications;
  const { id } = dbInfo; 

  const resources = await requestData(fhirStoreId, tables, id);

  return formatHistogramData(resources, x);
}

/**
 * Requests to the Healthcare API data for a Pie chart.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for a Pie chart.
 */
exports.healthcareApiPiechartData = async (dbInfo, specifications) => {
  const fhirStoreId = dbInfo.users["datastore"];
  const { tables, x } = specifications;
  const { id } = dbInfo; 
  
  const resources = await requestData(fhirStoreId, tables, id);

  return formatPiechartData(resources, x);
}

/**
 * Requests to the Healthcare API data for a Bar chart.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 The value requested for the Bar chart.
 */
exports.healthcareApiBarchartData = async (dbInfo, specifications) => {
  const fhirStoreId = dbInfo.users["datastore"];
  const { tables, x } = specifications;
  const { id } = dbInfo; 

  const resources = await requestData(fhirStoreId, tables, id);

  return formatBarchartData(resources, x);
}


// Healthcare API Utilities ---------------------------------------------------------------------------------------------------------------

/**
 * Makes the request for the data to Google Cloud Healthcare API.
 * 
 * @param fhirStoreId   The fhir store ID to where to request data
 * @param resourceType  The type of fhir resource being requested
 * @returns             A JSON object with the requested data.
 */
 const requestData = async (fhirStoreId, resourceType, id) => {
  const parent = `projects/${projectId[id]}/locations/${cloudRegion[id]}/datasets/${datasetId[id]}/fhirStores/${fhirStoreId}/fhir`;
  const request = {parent, resourceType};

  const response = await healthcare.projects.locations.datasets.fhirStores.fhir.search(
      request
  );
  return response.data.entry;
}