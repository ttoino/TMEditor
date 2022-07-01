---
id: couchdb
title: CouchDB
---

CouchDB is another database supported that follows a NoSQL paradigm however it doesn't support all the functionalities d

#### Functionalities not available:

- No **database structure** defined.
- No filters in data (only available for users table in `site.yaml`).
- No group by feature in data.
- No inner join aggregation.

#### New functionalities:

- The data requested to the server is now filtered by date when changed in DataPicker. It adds `?from=<start_timestamp>&to=<end_timestamp>` to the url and the server returns the data it has inside that range, preventing getting all the data.

The **data access** is done by defining a property `config` (similar to other databases):

```
config:
    username: <admin_username>
    password: <admin_password>
    host: <couchdb_host>
    port: <couchdb_port>
    protocol: <host_protocol>
```

Since CouchDB doens't have tables and is a document-oriented database, for the `default` subtype you should follow the following **specification** template in [Components](ui_components) declaration:

```
specifications:
    database: <database_id> # defined in site.yaml file
    database_name: <database> # actual database name
    document: <document_id>
    attribute: <attribute> # can be just one attribute or a list of attributes
```
