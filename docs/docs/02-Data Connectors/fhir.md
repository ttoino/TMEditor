---
id: fhir
title: FHIR
---

The FHIR connector currently only supports [Hapi FHIR](https://hapifhir.io) implementation of the [HL7 FHIR](http://hl7.org/fhir/) standard (version R4). In this connector, the field `table` links to the [resources](https://www.hl7.org/fhir/resourcelist.html) from the FHIR standard and for each one we use the [search](https://www.hl7.org/fhir/search.html) endpoints to retrieve the data, using the available and compatible filters if desired.

## Database configuration

To use this connector with an Hapi FHIR API, you need to configure the connection in the `site.yaml` file.

```yaml
- id: database_fhir
    type: fhir
    subtype: hapi
    config:
      url: http://hapi.fhir.org/baseR4
    authentication:
      username: myusername
      password: mypassword
    users: ...
```

### Config

The data access is done by defining a property `config`. This property only requires an `url` which indicates where the Hapi Server can be accessed.

```yaml
config:
  url: http://hapi.fhir.org/baseR4
```

Make sure that the URL does not end with `/` and that a resource can be searched by `{url}/{resource}`.

### Authentication

Since Hapi FHIR APIs' can require an Authorization header, the connector allows you to specify a Basic authentication (username and password) or Bearer authentication (bearer token).

```yaml
authentication:
  username: myusername
  password: mypassword
```

```yaml
authentication:
  bearer: mytoken
```

If the `authentication` property is not provided, Trial Monitor it will try to request data from the API without authentication.

## Data search

Since in the FHIR standard the values to get can be nested inside multiple objects, in this connector de values can be obtained by specifying the properties of each object separated by `.`. This can be used in `fields`, `target` and `groupby` properties.

#### Example

In this example `fields: [valueQuantity.value]` will retrieve the value `12`.

```json
{
  ...
  "entry": [
    {
      "fullUrl": "http://localhost:8080/fhir/Observation/102",
      "resource": {
        "resourceType": "Observation",
        "subject": {
          "reference": "Patient/52"
        },
        "valueQuantity": {
          "value": 12,
          "unit": "kg"
        }
        ...
      },
      ...
    },
    ...
  ]
}
```

:::warning

The names for the fields and the targets may vary. Check this [link](http://hapi.fhir.org/resource?serverId=home_r4&pretty=true&_summary=&resource=Observation) to see the available targets to be filtered.

In most Hapi FHIR APIs you can test the filtering for each resource in `https://<HAPI_FHIR_API_URL>/resource`.

:::