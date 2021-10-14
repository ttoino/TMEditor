---
id: fhir
title: Fhir
---

Within the Fhir data standard, two database types are supported: Google Cloud Healthcare API and Hapi Fhir Servers.

## Google Cloud Healthcare API

Data in the Fhir data standard is retrieved from the Google Cloud project created. For this to be possible, it is needed to add the following attributes to `site.yaml`, under the `config` attribute:

```
    projectId: myCloudProjectId
    cloudRegion: myCloudProjectRegion
    datasetId: myCloudDatasetRegion
```

These parameters allow to access the cloud project. The `projectId` is the id of the cloud project, `cloudRegion` is the region chosen, when creating the project, to store the data and `datasetId` is the id of the dataset from which we want to access the datastores.

Additionally, to access a Healthcare API project one needs a service account with access permissions. When creating such account, a JSON file containing the Key informations is downloaded. In the `packages/server/.env` file, add KEYFILEPATH=(absolute path to the key file in the local environment) for the google auth process to find.


## Hapi Fhir Servers

Data in the Fhir data standard is retrieved from a Hapi Server. For this to be possible, it is needed to add the following attributes to `site.yaml`, under the `config` attribute:

```
    serverUrl: url
    serverPort: port
```

These parameters allow to access a running Hapi server available in the Url given and exposed in the Port.
