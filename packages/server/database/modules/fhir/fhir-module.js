const { 
  healthcareApiLogin,
  healthcareApiRequestUsers,
  healthcareApiCardData,
  healthcareApiTableData,
  healthcareApiTimeseriesData,
  healthcareApiHistogramData,
  healthcareApiPiechartData,
  healthcareApiBarchartData
 } = require("./subtypes/healthcareApi.js");

const {
  hapiConnection, 
  hapiRequestUsers,
  hapiCardData,
  hapiTableData,
  hapiTimeseriesData,
  hapiHistogramData,
  hapiPiechartData,
  hapiBarchartData
} = require("./subtypes/hapi.js");

// The subtypes of each db (by their ID)
let dbSubtypes = [];

/**
 * Connects to the database of choice.
 * 
 * @param config          The configuration of the db, from the yaml file.
 * @param subtype         The subtype of the database.
 * @param nmAttributes    The attributes to be shown in the dashboard.
 * @param id              The database ID.
 * @returns               Depends on the database.
 *                        Healthcare API has no return.
 */
exports.connectToDatabase = async (config, subtype, nmAttributes, id) => {
  dbSubtypes[id] = subtype;

  switch(dbSubtypes[id]) {
    case "healthcareApi":
      return await healthcareApiLogin(config, nmAttributes, id);
    case "hapi":
      return await hapiConnection(config, nmAttributes, id);
    default:
      throw new Error("Invalid Database Subtype");
  }
}


/**
 * Requesting and formatting the users' data
 * 
 * @param dbInfo  The database details information, from the yaml file.
 * @returns       A JSON object with formatted user data, with the attributes stated in nmAttributes.
 */
exports.getUsers = async dbInfo => {
  switch(dbSubtypes[dbInfo.id]) {
    case "healthcareApi":
      return await healthcareApiRequestUsers(dbInfo);
    case "hapi":
      return await hapiRequestUsers(dbInfo);
    default:
      throw new Error("Invalid Database Subtype");
  }
}


/**
 * Receives parsed information from the yaml pages and requests, formats and returns the requested information depending on each UI component.
 * Already retrieves the information to be presented, if a card requests an average of a value, it already retrieves the calculated average.
 * 
 * @param element   (Object) Information about the requested UI component.
 *                    {"type":"table","title":"...","specifications":{"database":"...","tables":[...],"x":[...],"map":{}},"mappedAttributes":{}} 
 * @param _params   (Object) Parameters from the front end.
 *                    {"from":"2021-04-08","to":"2021-04-15"}
 * @param dbInfo    (Object) The database information in the yaml file.
 *                    {"id":"x","type":"x","config":{...},"users":{"table":"x","nmAttributes":[...]}} 
 * @returns 
 */
exports.getData = async (element, _params, dbInfo) => {
  const { type, specifications } = element;

  switch (type) {
    case "card":
      return await requestAndFormatCardData(dbInfo, specifications);
    case "table":
      return await requestAndFormatTableData(dbInfo, specifications);
    case "timeseries":
      return await requestAndFormatTimeseriesData(dbInfo, specifications);
    case "histogram":
      return await requestAndFormatHistogramData(dbInfo, specifications);
    case "piechart":
      return await requestAndFormatPieChartData(dbInfo, specifications);
    case "barchart":
      return await requestAndFormatBarchartData(dbInfo, specifications);
    default:
      throw new Error("Invalid Chart Type");
  }

}

/**
 * Makes the request for the data and treats it accordingly for the Card UI component.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 Directly the value (numeric) expected by the card. It requests the data, treats it, calculates the requested operation and returns the expected value. 
 */
const requestAndFormatCardData = async (dbInfo, specifications) => {
  switch(dbSubtypes[dbInfo.id]) {
    case "healthcareApi":
      return await healthcareApiCardData(dbInfo, specifications);
    case "hapi":
      return await hapiCardData(dbInfo, specifications);
    default:
      throw new Error("Invalid Database Subtype");
  }
}

/**
 * Makes the request for the data and treats it accordingly for the Table UI component.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 An object with the headers of the table (array) and the values of the table cells (array), with the following structure
 * {
 *    headers (array),
 *    values (array)
 * }
 */
const requestAndFormatTableData = async (dbInfo, specifications) => {
  switch(dbSubtypes[dbInfo.id]) {
    case "healthcareApi":
      return await healthcareApiTableData(dbInfo, specifications);
    case "hapi":
      return await hapiTableData(dbInfo, specifications);
    default:
      throw new Error("Invalid Database Subtype");
  }
}


/**
 * Makes the request for the data and treats it accordingly for the Timeseries UI component.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 An object with the x and y data (both arrays), with the following structure
 * 
 * {
 *    x: xData (array)
 *    y: yData (array)
 * }
 */
const requestAndFormatTimeseriesData = async (dbInfo, specifications) => {
  switch(dbSubtypes[dbInfo.id]) {
    case "healthcareApi":
      return await healthcareApiTimeseriesData(dbInfo, specifications);
    case "hapi":
      return await hapiTimeseriesData(dbInfo, specifications);
    default:
      throw new Error("Invalid Database Subtype");
  }
}

/**
 * Makes the request for the data and treats it accordingly for the Histogram UI component.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 An array with all of the values of the element requested. Then, the chart will count the frequencies of each element and create the diagram.
 * Example:
 *    [1,1,2] - Column 1-2 will have height 2, column 2-3 will have height 1. Upper limits are exclusive.
 */
const requestAndFormatHistogramData = async (dbInfo, specifications) => {
  switch(dbSubtypes[dbInfo.id]) {
    case "healthcareApi":
      return await healthcareApiHistogramData(dbInfo, specifications);
    case "hapi":
      return await hapiHistogramData(dbInfo, specifications);  
    default:
      throw new Error("Invalid Database Subtype");
  }
}


/**
 * Makes the request for the data and treats it accordingly for the Pie Chart UI component.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 An object with the x and y values with the following format
 * [
 *    x: Unique values of all of the values that are returned from the database (array),
 *    y: Amount of times that each of the values returned from the database appeared (array)
 * ]
 */
const requestAndFormatPieChartData = async (dbInfo, specifications) => {
  switch(dbSubtypes[dbInfo.id]) {
    case "healthcareApi":
      return await healthcareApiPiechartData(dbInfo, specifications);
      case "hapi":
        return await hapiPiechartData(dbInfo, specifications);
    default:
      throw new Error("Invalid Database Subtype");
  }
}


/**
 * Makes the request for the data and treats it accordingly for the Bar Chart UI component.
 * 
 * @param dbInfo            Database information incoming from the yaml file.
 * @param specifications    The specifications of the UI element declared in the yaml file.
 * @returns                 An array with the headers and values with the following structure
 * [
 *    x: headers (array),
 *    y: values (array)
 * ] 
 */
const requestAndFormatBarchartData = async (dbInfo, specifications) => {
  switch(dbSubtypes[dbInfo.id]) {
    case "healthcareApi":
      return await healthcareApiBarchartData(dbInfo, specifications);
    case "hapi":
      return await hapiBarchartData(dbInfo, specifications);
    default:
      throw new Error("Invalid Database Subtype");
  }
}