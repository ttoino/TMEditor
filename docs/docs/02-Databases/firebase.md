---
id: firebase
title: Firebase
---

Trial Monitor offers support to both types of Firebase databases: [Cloud Firestore](https://firebase.google.com/docs/firestore) and [Firebase Realtime Database](https://firebase.google.com/docs/database). Support for Firebase Real Database is limited to a single database and if data is normalized all data will be requested on a single query. For most projects we recommend Cloud Firestore.

## Config

The **data access** is done by defining a property `config`. This `config` is provided via the Firebase Console of the corresponding project:

```yaml
config:
  apiKey: 'PROJECT_API_KEY'
  authDomain: 'project-name.firebaseapp.com'
  databaseURL: 'https://project-name.firebaseio.com'
  projectId: 'project-name'
  storageBucket: 'project-name.appspot.com'
  messagingSenderId: 'XXXXXXXXXXXXX'
```

## Authentication

Sign in with email and password is currently supported on Firebase databases. In the configuration of each database include an object named `authentication` with an `email` and `password` properties:

```yaml
authentication:
  email: email@example.org
  password: mypassword
```

If the `authentication` property is not provide, the system it will try to connect to Firebase without authentication.

 
## Cloud Firestore

Cloud Firestore follows a NoSQL paradigm, in which data is organized on a flat structure, one level as max depth, avoiding sub-collections. Collections should have references to other collections in similar fashion to a SQL structure.

### Subcollection

Data in subcollections is not made available when requesting data from a collection. However, it is still possible to query data in subcollections with an independent request that creates a collection group with all subcollections.

To request data in subcollections, in the `table` property write hierarchical path of the subcollection:

````yaml
table: collection_name/subcollection_name
````

> Before using subcollections, you must create an [index](https://firebase.google.com/docs/firestore/query-data/queries#collection-group-query) that supports your collection group

## Data structure

Relatively to the **database structure**, according to the variation used, the configuration is also distinct. For the first case scenario, you must define the database structure as an array of collections. Each collection is identified by a name and has `attributes` in the form of an array of strings.


### Structure
- **attributes**: Array with the name of properties you want to retrieve from the database.
- **FK**:


````yaml
User:
  attributes: [ name, teste ]
Activities:
  attributes: [ timestamp, value ]
  FK: 
    name: user
    reference: User
````
The last case scenario also involves the definition of a property `FK` representing a foreign key which has a sub-property `name`(the name of the attribute) and `reference` (the name of the table to which it is linked to).

````yaml
User:
  attributes: [ name, test ]
Activities:
  attributes: [ timestamp, value, name, test ] # name and test are derived by User
````

### Timestamp
The property `timestamp` allows one to configure how the system will filter data by date. By default Trial Monitor will look for a property named `timestamp` in your document; however, if your database has uses a different name you can set that value here. 

- **timestamp**: (string | object) Name of the timestamp key on your database, or an object with the `name` and `type` properties:
  - **name**: Name of the timestamp  property on your database. Defaults to `timestamp`.
  - **type**: (optional) Unix timestamp are expected by default as data type. If you are using Firebase native timestamp you need to set the `type` property to `FirebaseTimestamp`.

````yaml
timestamp: myTimestampName
--- OR ---
timestamp:
  name: myTimestampName
  type: FirebaseTimestamp
````
