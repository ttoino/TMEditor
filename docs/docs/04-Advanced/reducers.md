---
id: reducers
title: Extending data formatting
---

With Trial Monitor we try to do some educated guesses regarding how data is structured based on each database type. Once data is retrieved it goes through our internal functions to be formatted so it can be interpreted by the UI components. While this works in most situations, data might be stored in a structured not supported. Understanding these use cases, it is possible to construct your own parsing functions to have control over the formatting process.

This can be accomplished by writing a reducer function that receives data as input, perform a set of operations over it and return the resulting data as an output.

## Creating the reducer function

To create a new reducer function:
1. Add a new `index.js` to the `config/reducers` directory
2. Export a function that will transform your data

That function will receive two arguments. The first argument is the data retrieved from the database without any processing; the second argument contains the component specification.

Within that function, transform the data according to your requirements and return the resulting data. Each UI component will expected different data structures, so check the documentation of the component for details of how data should be returned.

Example of a reducer function:

````js
const customReducer = (data, component) => {
  return data.map(row => {
    return {
      ...row,
      newColumn: parseInt(row.value) * 2.13
    }
  })
}

module.exports { customReducer }
````

## Using the reducer

Reducer functions can be applied to one of more Data Components. On the specifications of the component, add a new property named `reducer` with the value corresponding to the name of the function you are exporting


````yaml
reducer: customReducer
````
