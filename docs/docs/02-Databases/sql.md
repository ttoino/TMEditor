---
id: sql
title: SQL
---

SQL support is achieved through [Sequelize](https://sequelize.org/master/manual/getting-started). We need to define the connection parameters, as well as the database models and their relationships for the information we want to display on the user interface.

## Setting up a connection

We can connect by passing a URI:

````yaml
uri: mysql://username:password@host:port/DatabaseName
````

Or by passing the parameters individually using the `config` property:

````yaml
config:
  database: classicmodels
  username: user
  password: user123
  host: 172.18.1.27
````

If you are using SQLite, you should do the following:

````yaml
config:
  dialect: sqlite
  storage: path/to/database.sqlite
````

> Note that you have to manually install the [driver](https://sequelize.org/master/manual/getting-started.html) for your database of choice

## Configuring the database structure

Each table comprises a common set of properties:
+ `PK` - a string that identifies the name of the primary key. This field is not needed for scenarios where its use is direct, in other words, the table will not be joint with others.
+ `attributes` - an array containing the list of attributes that will be used by the UI components.
+ `relations` - an array of relations. A relation contains a:
    + `type` - the type of relation, assuming as values: \<belongsTo\> \| \<belongsToMany\> \| \<hasMany\>
    + `target` - the table to which it is linked to
    + `through` - only used in `N-M` relations, since it reflects the intermediate table that relates both
    + `FK` - the name of the foreign key (a relation of type `hasMany` does not require the definition of this property)

In a SQL typical structure, there can be three different types of relations: `1-1`, `1-N`, `N-M`.


### 1-* Relation
Both `1-1` and `1-N` are similar when it comes to its configuration with just a little tweak. If it is a `1-1` relation we choose one of the tables, that will reference the other
by having its type defined to `belongsTo` and the other one with it defined as `hasMany`. On the other hand, in a `1-N` relation, the table which is being referenced (meaning that has multiple) will contain a relation of type `hasMany` and the remaining one `belongsTo` as its type.

For example, we have:

~~~~yaml
- activities:
    PK: activity_id
    attributes: value
    relations:
      - type: belongsTo
        target: users
        FK: user_id
- users:
    PK: user_id
    attributes: age
    relations:
      - type: hasMany
        target: activities
~~~~

### N-M Relation

In a scenario where both tables are related to each other based on an `N-M` relation, naturally, it will result in an additional table. This table will not require additional information besides its attributes, while the tables that are related must acknowledge each other based on the `through` property.

~~~~yaml
 - product:
     PK: product_id
     attributes: [ name ]
     relations:
       - type: belongsToMany
         target: users
         through: productUser
         FK: product_id
 - productUser:
     attributes: [ product_id, user_id ]
 - users:
     PK: user_id
     attributes: age
     relations:
       - type: belongsToMany
         target: product
         through: productUser
         FK: user_id
~~~~
