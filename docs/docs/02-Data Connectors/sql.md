---
id: sql
title: SQL
---

The SQL connector offers support to common SQL dialects (PostgreSQL, MySQL, MariaDB, SQLite and MSSQL), and uses [Sequelize](https://sequelize.org/master/manual/getting-started) under the hood to make the connections.

## Setting up a connection

The database connection can be configured by defining individual connection parameters or a single connection URI in the `config` property.

Using the connection URI:

````yaml
config: mysql://username:password@host:port/DatabaseName
````

Or by passing the parameters individually using the `config` property:

````yaml
config:
  dialect: mariadb
  database: sql_db
  host: 172.18.1.27
````

If you are using SQLite, you should do the following:

````yaml
config:
  dialect: sqlite
  storage: path/to/database.sqlite # Relative to config folder
````

> Note that you have to manually install the [driver](https://sequelize.org/master/manual/getting-started.html) for your database of choice

## Authentication

If required, in the configuration of each database include an object named `authentication` with an `username` and `password` properties:

```yaml
authentication:
  username: email@example.org
  password: mypassword
```

## Configuring the database structure

By default, the connector will try to generate the database models and their relationships. However, relations through an intermediate table might not be identified and must be defined manually. The `structure` property enable us to manually define these relations.


Each table comprises a common set of properties:
- **relations** - an array of relations. A relation contains a:
  - **type** - the type of relation, assuming as values: `belongsTo` | `belongsToMany` | `hasMany`
  - **target** - the table to which it is linked to
  - **through** - only used in `N-M` relations, since it reflects the intermediate table that relates both
  - **FK** - the name of the foreign key (a relation of type `hasMany` does not require the definition of this property)
