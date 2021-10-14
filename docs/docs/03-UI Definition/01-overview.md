---
id: overview
title: Overview
---

The system allows the definition of a configuration that reflects the user interfaces presented to the user. Each page content and layout is displayed according to the information stored in the files inside the directory `config/blueprints/pages`. 

~~~~
├── config
|   ├── blueprints
    |   ├── pages
    |   |  ├── activities.yaml
    |   |  └── questionnaires.yaml
    |   └── site.yaml
~~~~


For each file, a link to a page will be generated in the left sidebar, thus, it **must** have configured a property named `title` - the name to be shown in the user interface (otherwise the name of the file will be taken into consideration). The page URL will be generated from the filename. The property `components` will contain the list of UI components, and the layout can be configured through the property `layout` (optional).

~~~~yaml
# activities.yaml
title: Activity Level

layout: [ ... ]

components: [ ... ]
~~~~


Above it is exemplified a scenario where we describe a page and its [layout](layout), as a section composed of a single row containing the only UI component defined, a card.
