---
id: overview
title: Overview
---

Trial Monitor is capable of connecting to multiple databases and present information from these different databases under a single interface. Currently we support four different types of databases: [SQL](sql), [Firebase](firebase), and [Fhir](fhir)\*.

The main functionalities are:

- **`the attribute selection` -** Allows the selection of a subset of attributes from the target tuples/documents.
- **`the inner join aggregation` -** Allows the combination of multiple tables, which involves the concept of referring other tables.
- **`the filtering operation` -** Provides a way of filtering the information to be retrieved according to specified operators and thresholds.

## Database definition

In order to retrieve that same data, you must define both the data structure and database access details in the file `site.yaml` inside the directory `config/blueprints`. **Note:** You only need to define the structure of the desired data and not the whole schema.

In the `site.yaml` you must define a property `databases` which contains one or multiple database definitions, for instance:

````yaml
databases:
  - id: dbName
    type: mysql
    users:
      table: User
      idAttribute: externalID
      nmAttributes: [name, gender, birthDate]
      filters:
        - target: isAdmin
          operator: '=='
          value: 1
````

Each database definition has:

- **id** - a string that should be defined in case there are multiple databases
- **type** - `<firebase>` \| `<mysql>` \| `<postgresql>` \| `<mariadb>` \| `<sqlite>` \| `<mssql>`
- **subtype** - only if type is `firebase`, `coubdb` or `fhir`
  - **firebase**: `<realtime>` \| `<cloudfirestore>`
  - **fhir**: `<healthcareApi>` \| `<hapi>`
- **config** - properties for data access. Check the corresponding database page for more information.
- **users** - as a table or collection related to the users of the system always exists, it is through this property you are able to define:
  - `table` - the name of the table or document.
  - `idAttribute` - the user identifier. It should be defined in case there are multiple databases and the identifier is a normal attribute instead of a primary key. This `idAttribute` will assume values similar to other databases users identifiers.
  - `nmAttributes` - the attributes to be presented in the participants table. It can either assume the value of an array or in case it is not defined, all attributes will be shown.
  - `filters` - enables developers to filters users according to specific values.

- **structure** - the data structure for the database. Check the corresponding database page for more information.

### Filters

 Filters are defined based on the property `filters`, consisting of an array of filters. Each filter entry contains:
  - `target` - the attribute to be the target for filtering
  - `operator` - as the name implies, the operator to be applied
  - `value` - the value to be compared with

````yaml
filters:
  - target: isAdmin
    operator: '=='
    value: false
````
