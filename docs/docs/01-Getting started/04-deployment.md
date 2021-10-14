---
id: deployment
title: Deployment
---

## Docker

To launch Trial Monitor in production run:

```
docker-compose up
```

By default Trial Monitor will be served from the root of the server and without authentication. However, you can set the `args` property with the appropriate variables of your environment.

```
...
args:
  - WEBAPP_API_BASE_URL:/
  - PUBLIC_URL:/
  - AUTH:KEYCLOACK
```

## Authentication

Trial Monitor currently supports authentication through [Keycloak](https://www.keycloak.org/) and Firebase. To enable authentication set the variable `AUTH` in the environmental variables to either `KEYCLOAK` or `FIREBASE`.

````
AUTH:FIREBASE | KEYCLOACK
````

For authentication with Keycloak:
1. Put the `keycloak.json` with the authentication details in the `config` folder.

For authentication with Firebase:
1. Add to the `config` folder a file named `firebaseConfig.json` with the Firebase configuration.
2. And to the same folder add a file named `firebaseServiceAccount.json` with the Firebase service account details.
3. Add add copy of the `firebaseConfig.json` to the `packages/client` folder.

> Be aware that you should not commit the Firebase service account file to a public repository.
