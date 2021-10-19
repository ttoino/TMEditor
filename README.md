# Trial Monitor

Trial Monitor is a tool that enables developers and researchers to create personalized web dashboards for monitoring participants in technology-enabled field trials. The tool was designed to reduce the work of developing one’s own dashboard, the need to adapt the technology stack to an existing dashboard, or the need to create a different dashboard tool for each project.

Trial Monitor uses simple configuration files to define the connection to different databases, the types of visualizations to be used, and the user interface that researchers will see to make sense of the user-generated data.

## Installation

Trial Monitor can either be installed directly on your machine or use through Docker. In the repository, we provide a config with examples and sample data, as well as Docker files for easy deployment. To install Trial Monitor on your machine:


1. Clone the repository on your machine

````
git clone https://github.com/fraunhoferportugal/trial-monitor.git
````

2. Rename `config.template` to `config`

3. Install the dependencies

````
yarn install
````

4. Edit the files in the `config` folder according to the needs of your project

## Running Trial Monitor

To use Trial Monitor directly on your machine just run:

```
yarn run dev
```

Or use can use the `docker-compose` file:

```
docker-compose -f docker-compose.yaml up // Production

docker-compose -f docker-compose.dev.yaml up  // Development
```

In development mode, trial monitor will run by default on port `3000`. When running in development mode all changes in the config files will be automatically reflected on the interface.

## Requirements
Ensure that you have [Node](https://nodejs.org/) installed on your machine or Docker according to your desired set up.

## Citing

When using Trial Monitor please cite the following publication:

Ribeiro J., Lima P., Nunes F. "Trial Monitor: Scaffolding Personalised Web Dashboards for Human-Computer Interaction Field Trials". SoftwareX (under review) (2021).