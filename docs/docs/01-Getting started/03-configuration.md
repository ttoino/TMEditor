---
id: configuration
title: Configuration
---

Trial Monitor uses simple configuration files to set up the platform for a specific project. Each instance of Trial Monitor has a folder with YAML or JSON files that personalize among other things the database authentication credentials, Web pages for displaying data, or the characteristics of each data visualization employed.

## Configuration structure

The `config` folder should look like this:

````
config
├── blueprints
├──── pages
├────── page1.yaml
├────── page2.yaml
├──── dashboard.yaml
├──── site.yaml
├── reducers
├── auth
├── cohorts
├── ui-config.json
````

- `/blueprints`: contains the site and page configurations
- `/auth`: contains the configuration of the system authentication
- `/reducers`: (optional) contains one or more files, exporting custom functions for parsing data
- `/cohorts`: (optional) allows manually grouping users into cohorts
- `ui-config.json`: api url, auth and theme configurations for the UI

## Blueprints

The `blueprints` folder contains the configuration files with the database authentication credentials, or pages and data visualizations specifications:

- `site.yaml` is the main configuration file and contains the configurations to the database, and overall settings for the platform (e.g. project title)
- `pages/` contains the individual page configurations (one file per page)
- `dashboard.yaml` (optional) contains the configuration of the web app main page. For more information please check the [Dashboard](../UI%20Definition/dashboard) page.


### `site.yaml`

The `site.yaml` file contains configurations of the databases and other global properties.

````yaml
title: Project name
usersDB: database_id
cache:
  expireTime: 3600

databases:
  - id: database_id
    type: firebase
    ...
````

- **title**: Project name
- **usersDB**: (optional) Users database
- **cache**: (optional) Specify cache expire time (default value is 300 seconds). To use cache make sure `redis` service is running and accessible.
- **databases**: Is an array that describes the configuration of one or more databases. Please check [Database](../Databases/overview) for details.



### Pages

The pages folder contains one or more `yaml/json` files that describe the interface of each page. Each configuration file allows the configuration of the following properties:

- **title**: Describes the name of the page and navigation
- **components**: A list of data visualization components. Please check [UI Definition](../UI%20Definition/overview) for details.

````yaml
title: Page title

components:
  - type: table
    title: Table title
    query:
      database: database_id
      table: table_name
````

## Cohorts

By default Trial monitor displays all participants on a single list. However, it is possible to manually create cohorts to organize user data:

1. Add a file named `cohorts.yaml` to the `config` folder.
2. There are two possible ways to define the cohorts:
  - Group users by a field

  ````yaml
  groupByField: gender
  ````

  - Create a map associating the cohorts with a list of users' identifiers

  ````yaml
  map:
    PT:
      - 1
      - 2
    USA:
      - 3
  ````

## Theming

Trial Monitor can be customized according to the styles of your project/brand. To create a custom theme, edit the `ui-config.json` file in the `/public` (w/o Docker) or `config/` (w/ Docker) folder according to your preference. Check the `ui-config.json` file in the `config.template` folder to see all options that can be configured.


````json
{
  "theme": {
    "colors": {
      "primary": "#007EB2",
      "primaryTint": "#F2F5F8",
      "primaryTintHover": "#e5ecf3",
      "surface": "#ffffff",
      "text": "#464646"
    },
    "fonts": {
      "body": "Roboto, sans-serif"
    }
  }
}
````

### Logo
To customize the logo that appears on the sidebar and login page, add an image file to the `/public` (w/o Docker) or `config/` (w/ Docker) folder on the server and set the `logo` field with the correct value.


````json
{
  "theme": {
    "logo": "logo.svg"
  }
}
````