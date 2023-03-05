ARG PUBLIC_URL=
ARG AUTH=

FROM node:16 as builder
WORKDIR /app
COPY ./package*.json /app/
RUN yarn install

# so global vars are available on this stage
ARG PUBLIC_URL
ARG AUTH

COPY . .
RUN API_URL=/api yarn run build

FROM nginx:1.21-alpine
ARG PUBLIC_URL

WORKDIR /app
COPY nginx/nginx.conf.template /etc/nginx/conf.d/default.conf.template
# argument to envsubst prevents $uri from being replaced (by empty text)
RUN PUBLIC_URL=${PUBLIC_URL} envsubst '${PUBLIC_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html${PUBLIC_URL}
