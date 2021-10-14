// Formatting Fhir resource data for each UI component -------------------

exports.formatCardData = (resources, x, operator) => {
  const values = resources.map((resource) => searchInObject(resource, x));

  switch (operator) {
    case "avg":
      return stringArrayToNumberArray(values).reduce((acc, curr) => acc + curr) / values.length;
    case "count":
      return values.length;
    case "max":
      return Math.max(...stringArrayToNumberArray(values));
    case "min":  
      return Math.min(...stringArrayToNumberArray(values));
    default:
      throw new Error("Invalid Operation");
  }
}


exports.formatTableData = (resources, x) => {
  let values = [];
  for (let j in resources) {
    values.push([]);
    for (let k in x) {
      values[j].push(searchInObject(resources[j].resource, x[k])[0]);
    }
  }

  return {x, values};
}


exports.formatTimeseriesData = (resources, x, y) => {
  const xData = searchInObject(resources, x);
  const yData = searchInObject(resources, y);

  return {
    x: xData,
    y: yData
  }
}


exports.formatHistogramData = (resources, x) => {
  const xValues = [];
  resources.forEach(resource => {
      xValues.push(searchInObject(resource, x))
  });

  return xValues.flat();
}


exports.formatPiechartData = (resources, x) => {
  const xValues = [];
  resources.forEach(resource => {
      xValues.push(searchInObject(resource, x))
  });

  [values, counts] = countArrayValuesRepetitions(xValues.flat());
  
   return { 
    x: values,
    y: counts
  };
}


exports.formatBarchartData = (resources, x) => {
  const values = [];
  resources.forEach(resource => {
    values.push(searchInObject(resource, x));
  });

  return {
    x: x,
    y: values.flat()
  }
}


/**
 * Formats users' data to a "clean" object containing only the attributes requested in site.yaml.
 * 
 * @param data Users' data 
 * @returns    Formatted object with the attributes set in usersTableAttributes.
 */
exports.formatUserData = (data, attributes) => {
  let formattedData = {};

  for (let i in data) {
      let user = {};
      for (let j in attributes) {
      if (data[i].resource.hasOwnProperty(attributes[j])){
          if(attributes[j] == 'name') {
          let name = "";
          for (let k in data[i].resource.name[0].given) {
              name += data[i].resource.name[0].given[k] + " ";
          }
          name += data[i].resource.name[0].family;
          user[attributes[j]] = name;
          }
          else {
          user[attributes[j]] = data[i].resource[attributes[j]];
          }
      }
      }
      formattedData[i] = user;
  }

  return formattedData;
}

// General Utilities ----------------------------------------------------------------------------------------------------------------------

/**
 * Searches in an object obj for all values that have the key key and returns an array with those values.
 * Adapted from http://techslides.com/how-to-parse-and-search-json-in-javascript
 * 
 * @param obj   The object from where to search values.
 * @param key   The key of the values we wish to search for.
 * @returns     An array with the objects that have the key @key
 */
const searchInObject = (obj, key) => {
  var results = [];
  for (var i in obj) {
      if (!obj.hasOwnProperty(i)) continue;
      if (typeof obj[i] == 'object') {
          results = results.concat(searchInObject(obj[i], key));
      } else if (i == key) {
          results.push(obj[i]);
      }
  }
  return results;
}

/**
 * Converts a string array to a number array.
 * 
 * @param array   String array 
 * @returns       Number array
 */
const stringArrayToNumberArray = (array) => {
  return array.map((i) => parseInt(i));
}


/**
 * Receives an array of values and returns two arrays, one with unique values of the original array and the other with the count of each value.
 * Adapted from http://jsfiddle.net/om2pcwn8/1/
 * 
 * @param  array      Array with values
 * @returns @vals     With all the values of the original array ordered and without repetitions.
 * @returns @counts   On the corresponding index of each vals value, the number of times that that value appeared on the original input array.
 */
const countArrayValuesRepetitions = (array) => {
  let vals = [], counts = [], prevValue;

  array.sort();
  for (let i in array) {
    if(array[i] !== prevValue) {
      vals.push(array[i]);
      counts.push(1);
    } else {
      counts[counts.length-1]++;
    }
    prevValue = array[i];
  }

  return [vals, counts];
}