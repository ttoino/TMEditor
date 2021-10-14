---
id: dashboard
title: Dashboard
---

The Dashboard of the system by default displays a table listing all users and users' properties. It is, however, possible to configure the Dashboard with additional components.

To configure the Dashboard create a file name named `dashboard.md` inside the `blueprints` folder.

**Properties:**

- **`alerts`** - Creates a table with warning for specific attributes.
- **`summary`** - Creates a summary of the data in the users' table.
- **`users`** - Configuration of the users' table.

## Alerts

The Dashboard can be configure with a table displaying warnings for specific attributes. This enables researchers to quickly monitor specific parameters of the system (e.g. check if the average value for the blood pressure is within the reference values).

The `alerts` property contains a list with a reference to the `database`, `table` holding the data, and a list of `attributes`. The configuration should have the following structure:

````yaml
alerts:
  - database: fradedev
    table: SurveyNps
    attributes:
      - name: answer
        threshold: 6
        comparison: '>'
        aggregation: avg
````


**Alert structure:**
- **`database`** - the name of the database
- **`table`** - the name of the table or document holding the data
- **`attributes`** - a list describing the attributes
  - **`name`** - (string) Name of the attribute
  - **`threshold`** - (number) threshold value for triggering the warning in the interface
  - **`comparison`** - `>` | `<` | `=>` | `=>` | `==`
  - **`aggregation`** - `avg` | `max` | `min` | `sum`

## Summary

The Summary component allows the visualization of summarized values presented in the users' table.

**Properties:**
- **`id`** - the description of the column from where we want to extract the data.
- **`type`** - `average` \| `percentage` \| `histogram` Type of operation to be performed on the data.
- **`subtype`** -`date` Treats values as date. Available if the type is `average` or `histogram`.
- **`label`** - (Optional) A string representing the label of this summary. If no label is provided, the `id` will be used.

**Types:**
- **`average`** - calculate the average of the values on the selected column.
- **`percentage`** - generates a list with the percentage of each value on the selected column.
- **`histogram`** - generates a chart with the distribution of values on the selected column

## Users table

The `users` property enables the configuration of the table displaying the users data.

- **`show`** - (boolean) Sets the visibility of the table. Default: `true`.
- **`attributes`** - (string[]) Configures which attributes to display in the table. If not set, all attributes will be displayed.
- **`export`** - (boolean) Show a button to export the data to *CSV*. Default: `false`.
- **`pagination`** - (boolean or number) Sets the number rows per page. Default: 20 rows per page.

