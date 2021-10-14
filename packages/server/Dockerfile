
FROM node:16

ARG PUBLIC_URL=
ARG BACKEND_PORT=

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY ./package*.json ./

RUN npm install --production --silent

# Bundle app source
COPY . .

RUN echo " \
PUBLIC_URL="${PUBLIC_URL}" \n \
BACKEND_PORT="${BACKEND_PORT}" \n\
" > config/.env

EXPOSE 80

CMD [ "npm", "start" ]
