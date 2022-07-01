---
id: custom-permissions
title: Custom permissions
---

With Keycloak authentication, by default, users have access to all pages and components. However, you might want to limit the access to specific pages or components to certain users. We can achieve this by taking advantage of Keycloak roles.

1. On Keycloack, you will need to create groups and assign users to these groups.

2. Inside the `trial-monitor-api` client, on the Roles tab, create new roles according to your needs. 

3. On the `auth.json` file, assign the roles to the correct groups. 

```json
{
  // ...
  "groups": {
    "admin": [
      "read-activity",
      "read-sensitive-info"
    ],
    "user": [
      "read-activity",
    ]
  }
}
```

4. And finally, on the page config file, define the `requiredPermissions` property with a list of roles that have permissions to access the page or component. 


````yaml
title: Example Page
requiredPermissions:
  - read-activity
  - read-sensitive-info

components:
  - type: table
    title: Table
    requiredPermissions:
      - read-activity
    query:
      # ...

````

With this configuration, only users who are part of a group with these roles will be able to access the page/component.