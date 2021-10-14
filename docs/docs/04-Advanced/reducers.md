---
id: reducers
title: Extending data formatting
---

With Trial Monitor we try to do some educated guesses regarding how data is structured based on each database type. Once data is retrieved it goes through our internal functions to be formatted so it can be interpreted by the UI components. While this works in most situations, data might be stored in a structured not supported. Understanding these use cases, it is possible to construct your own parsing functions to have control over the formatting process.

This can be accomplished by writing a reducer function that receives data as input, perform a set of operations over it and return the resulting data as an output.

## Creating the reducer function

To create a new reducer function:
1. Add a new file to the `config/reducers` directory
2. Export a function that will transform your data

That function will receive two arguments. The first argument is the data retrieved from the database without any processing; the second argument contains an object with custom arguments passed to the reducer.

Within that function transform the data according to your requirements and return the resulting data. Each UI component will expected different data structure, so check the documentation of the component for details of how data should be exported.

Example of a reducer function:

````js
exports.groupAndFilterData = (data, args) =>  {
  const filteredData = data.filter(el => el.id === args.id)

  const measuresGrouped = filteredData.reduce((acc, curr) => {
    acc[curr.id] = acc[curr.id] || []
    acc[curr.id].push(curr)
    return acc
  }, {})

  return {
    x: Object.keys(measuresGrouped),
    y: Object.values(measuresGrouped)
  }
}
````

> Exported function names must be unique. Do not write function with the same name even if they are in different files.

## Using the reducer

To use the function you have created in the previous step, on the specifications of the UI Component add a new property named `reducer` with the value corresponding to the name of the function you are exporting, or an object with the reducer information.

- **reducer**: (string | object) Name of the reducer function, or an object with the `name` and `args` properties:
  - **name**: Name of the reducer function
  - **args**: (optional) Custom object with additional properties you want to pass to the reducer.

````
reducer: groupAndFilterData

# --- OR ---

reducer:
  name: groupAndFilterData
  args:
    id: 8
````
