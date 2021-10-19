---
id: configuration
title: Configuration
---

Trial Monitor uses simple configuration files to setup the platform to a specific project. Each instance of Trial Monitor has a folder with YAML files that personalize among other things the database authentication credentials, Web pages for displaying data, or the characteristics of each data visualization employed.


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
├── cohorts.yaml
````

<!-- * `/blueprints`
  * `/pages` — contains individual page configurations (one file per page)
  * `site.yaml` – contains database configuration and general settings;
  * `dashboard.yaml` — (optional) contains the configuration of the web app main page;
* `/reducers` — (optional) contains one or more files, exporting custom functions for parsing data;
* `/cohorts.yaml` — (optional) enables developers to manually group users into cohorts;
* `/user-mapping.yaml` — (optional) defines how to map long or hashed user identifiers to human-readable names. -->


## Blueprints

The `blueprints` folders contains the configuration files with the database authentication credentials, or pages and data visualizations specifications:

- `site.yaml` is the main configuration file and contains the configurations to the database, and overall settings for the platform (e.g. project title)
- `pages/` contains the individual page configurations (one file per page)
- `dashboard.yaml` (optional) contains the configuration of the web app main page. For more information please check the [Dashboard](../UI%20Definition/dashboard) page.

 
### `site.yaml`

The `site.yaml` file contains the databases configurations and other global properties.

````yaml
title: Project name
usersLocation: databaseid
databases:
  - id: db1
  ...
````

- `title` Project name
- `usersLocation` String or Array with the id of databases that you want to show on the dashboard
- `databases`: Can be either an object with the configuration of a single database, or an array of databases. Check [Database](../Databases/overview) for details.



### Pages

The pages folder contains one or more `yaml` files that describe the interface of each page. Each configuration file allows the configuration of the following properties:

- `title` Describes the name of page and navigation
- `components` A list of data visualization components 
- `layout` (optional) Configuration of how components are arranged in the interface

````yaml
title: Page title

components:
  - type: table
    title: Measures
    specifications:
      database: dbname
      table: sessions
````


## Cohorts

By default Trial monitor displays all participants on a single list. However, it is possible to manually create cohorts to organize user data:

1. Add a file named `cohorts.yaml` to the `config` folder.
2. For each cohort, create a list with the user identifiers you want to associate with the cohort.

````yaml
PT:
  - 5Z64g9t5mvT9CLn9cgxo
  - FTwFXLkbL9dG7ybsBDnd
USA:
  - ZFmXh7OzbmQwzQOWvzao
````

To enable *cohorts* in the user interface, in the `site.yaml` file set the property `cohorts`to `true`:


````yaml
cohorts: true
````

<!-- ## Theming

You can customize your installation of Trial Monitor by changing the main colors according to the styles of your project. To customize these styles add a new file named `theme.yaml` to the `blueprints` folder, and define the color properties according to your brand. Check the `theme.yaml` file provided with the starterkit to see all options that can be configured.

Note that hexadecimal color values must be defined within quotes, otherwise they will be interpreted as comments.

````
color-primary: "#009474"
color-text: black
````

> Changes to `theme.yaml` require the client to be restarted

### Logo
To customize the logo that appear on the sidebar and login page, add an image file named `logo.png` to the `config` folder. -->
