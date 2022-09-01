---
id: firebase
title: Firebase
---

The Firebase connector currently supports [Cloud Firestore](https://firebase.google.com/docs/firestore) databases. The Cloud Firestore connector follows a NoSQL paradigm, in which data is organized on a flat structure. Collections should have references to other collections in a similar fashion to a SQL structure. A collection is linked by defining a property that references the doc id in other collections.

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

If the `authentication` property is not provided, Trial Monitor it will try to connect to Firebase without authentication.

<!-- ### Subcollection

Data in subcollections is not made available when requesting data from a collection. However, it is still possible to query data in subcollections with an independent request that creates a collection group with all subcollections.

To request data in subcollections, in the `table` property write hierarchical path of the subcollection:

````yaml
table: collection_name/subcollection_name
````

> Before using subcollections, you must create an [index](https://firebase.google.com/docs/firestore/query-data/queries#collection-group-query) that supports your collection group -->

## Data structure

### Structure

The ``structure`` field is what enables Trial Monitor to know how Firestore collections are connected to each other. To created a relation between collections, on the configuration of each collection, define a property named `relations`. Inside, create a new property with the name of the linked collection with the value of the property used to identify that collection.

````yaml
structure:
  users:
    relations:
      usersDetails: UserId
  userDetails:
    relations:
      clinicalConditions: ClinicalConditionId
````

### Timestamps

The Firebase connector can interpret Unix or Firebase native timestamps. Unix timestamps are expected by default.

- **timestampField**: (string | object) Name of the timestamp key on your database, or an object with the `name` and `type` properties:
  - **name**: Name of the timestamp property on your database. Defaults to `timestamp`.
  - **type**: (optional) If you are using Firebase native timestamp you need to set the `type` property to `FirebaseTimestamp`.

````yaml
timestamp: myTimestampName

// --- OR ---

timestamp:
  name: myTimestampName
  type: FirebaseTimestamp
````

:::note

 Note that you will need to create an index on the Firebase console to be able to filter by date and user simultaneously

:::