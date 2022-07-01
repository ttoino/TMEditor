---
id: overview
title: Overview
---

Trial Monitor is capable of connecting to multiple databases and presenting information from these databases under a single interface. Currently Trial Monitor has database connectors for [SQL](sql), and [Firebase](firebase).

Each database connector has the following responsibilities:

- **Fields selection:** Selects a subset of attributes from the target tables/documents.
- **Data aggregation:** Combines multiple tables/docs under a single data frame.
- **Filtering:** Filters data based on the frontend state.

## Database definition

Databases are defined in the `site.yaml` file inside the directory `config/blueprints`. In this file you must define a property `databases` which contains one or multiple database definitions, for instance:

````yaml
databases:
  - id: dbName
    type: mysql
    users:
      table: User
      idField: externalID,
      labelField: name
      fields: [name, gender, birthDate]
      filters:
        - target: isAdmin
          operator: '=='
          value: 1
````

Each database definition has:

- **id**: a unique string that should be defined in case there are multiple databases
- **type**: `firebase` | `fhir` | `mysql` | `postgresql` | `mariadb` | `sqlite` | `mssql`
- **subtype**: database subtype. Check the corresponding database for the available subtypes.
- **config**: properties for data access. Check the corresponding database page for more information.
- **users**: as a table or collection related to the users of the system always exists, it is through this property you are able to define:
  - **table**: the name of the table or document.
  - **idField**: the name of the field that holds the user identifier
  - **labelField**: (optional) which field will be used on the frontend to identify users'. If not provided, the `idField` will be used.
  - **fields**: an array with the fields you want to display on the participants table. If not defined, all fields will be shown.
  - **filters**: enables developers to filter users according to specific values.

- **structure** - (optional) definition of the data structure for the database. Check the corresponding database page for more information.
- **timestampField** - (optional) name of the field used for filtering data by date

### Filters

 Filters are defined with the property `filters` and consist of an array of filters. Each filter entry contains:
  - **target** - the attribute to be the target for filtering
  - **operator** - as the name implies, the operator to be applied. The available operations are defined [here](#available-operations).
  - **value** - the value to be compared with

````yaml
filters:
  - target: isAdmin
    operator: '=='
    value: false
````

#### Available operations

| Operator | SQL | Firebase | FHIR |
|---|---|---|---|
| == | ✅ | ✅ | ✅ |
| != | ✅ | ✅ | ✅ |
| > | ✅ | ✅ | ✅ |
| >= | ✅ | ✅ | ✅ |
| < | ✅ | ✅ | ✅ |
| <= | ✅ | ✅ | ✅ |
| +- | ❌ | ❌ | ✅ |
| contains | ❌ | ❌ | ✅ |
| exact | ❌ | ❌ | ✅ |
| in | ❌ | ✅ | ✅ |
| not-in | ❌ | ✅ | ❌ |
| array-contains | ❌ | ✅ | ❌ |
| array-contains-any | ❌ | ✅ | ❌ |

:::note

For Hapi FHIR APIs check this [link](http://hapi.fhir.org/resource?serverId=home_r4&pretty=true&_summary=&resource=Observation) to see the available targets to be filtered.

:::
### Timestamps

The property `timestampField` allows the configuration of how the system will filter data by date. If no timestamp field is defined, or if the database doesn't have time data, all data will be retrieved.

You can set a global `timestampField` on the main database config, if all tables share the same property name:

````yaml
  - id: database_id
    timestampField: myTimestampField
    ...
````

Or a different value for each table/doc:

````yaml
  - id: database_id
    timestampField: myTimestampField
    structure:
      table_name:
        timestampField: otherName
````

> Please check the corresponding database page for more information.