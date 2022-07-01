
FROM node:16 as builder

ARG PUBLIC_URL=
ARG BACKEND_PORT=

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./

RUN yarn install --prod --silent

# Bundle app source
COPY . .

RUN yarn run build

CMD [ "node", "-r", "source-map-support/register", "dist/index.js" ]
