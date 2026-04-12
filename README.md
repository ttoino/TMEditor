# FEUP-PI

Group project for the PI course unit at FEUP.

This project consisted of developing an extension to Trial Monitor, a tool for creating personalized web dashboards for monitoring participants in technology-enabled field trials. The main contribution was the development of a **configuration editor** that allows researchers to create and edit dashboard configurations through an intuitive user interface.

## Editor Package

The `packages/editor` directory contains a React-based configuration editor that provides:

- Visual editing of dashboard configurations
- Real-time preview of changes
- Support for multiple data connectors (Firebase, CouchDB, SQL, FHIR)
- Customizable UI components and layouts
- Interactive data visualization configuration

### Building and running the editor

The editor uses [Snowpack](https://www.snowpack.dev/) as the build tool. To build and run:

```bash
cd packages/editor
yarn install
yarn start
```

The editor will run on `http://localhost:8080` by default.

## Original Project

Trial Monitor is a tool developed by Fraunhofer Portugal that enables developers and researchers to create personalized web dashboards for monitoring participants in technology-enabled field trials. See [README.old.md](README.old.md) for the full original documentation.

## Unit info

- **Name**: Projeto Integrador (Integrator Project)
- **Date**: Year 2, Semester 2, 2022/23
- [**More info**](https://sigarra.up.pt/feup/ucurr_geral.ficha_uc_view?pv_ocorrencia_id=501692)

## Disclaimer

This repository (and all others with the name format `feup-*`) are for archival and educational purposes only.

If you don't understand some part of the code or anything else in this repo, feel free to ask (although I may not understand it myself anymore).

Keep in mind that this repo is public. If you copy any code and use it in your school projects you may be flagged for plagiarism by automated tools.
