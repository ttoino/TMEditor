---
id: overview
title: Overview
---

Trial Monitor can be organized into pages, and each page can be customized according to the requirement of each project. The user interface of each can be configured by arranging the different data visualization and layout components that are made available.

~~~~
├── config
|   ├── blueprints
    |   ├── pages
    |   |  ├── activities.yaml
    |   |  └── questionnaires.yaml
    |   └── site.yaml
~~~~


A new page will be generated for each file on the directory `config/blueprints/pages`. The title of the page will be based on the `title` property. If the `title` is not provided, the file name will be used.

The `components` property contains the list of components for displaying data and for configuring the layout. For more information on how to configure interface components please check the next pages.


````yaml
# activities.yaml
title: Activity Level

components: [ ... ]
````