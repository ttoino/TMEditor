---
id: layout
title: Layout
---

Trial Monitor provides interface components to support the personalization of the layout of each page.

## Heading

The `heading` element can be used to a create visual hierarchy on the page.

````yaml
- type: heading
  title: Heading name
````

## Columns

The `columns` element enables us to create a grid layout with multiple columns. Columns of equal size will be created based on the number of components provided.

````yaml
- type: columns
  components:
    - type: chart
      ...
    - type: table
      ...
````

## Tabs

The `tabs` element can be used to organize components in multiple tabs.

````yaml
- type: tabs
  panels:
    - label: Tab 1
      components:
        - ...
    - label: Tab 2
      components:
        - ...
````

## Info

The `info` element enables us to display general information on the page, such as warnings or guidance to help users read the charts.

````yaml
- type: info
  title: Heading name
````
