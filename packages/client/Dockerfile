ARG PUBLIC_URL=
ARG AUTH=

FROM node:16 as builder
WORKDIR /app
COPY ./package*.json /app/
RUN npm install

# so global vars are available on this stage
ARG PUBLIC_URL
ARG AUTH

COPY . .
RUN echo " \
PUBLIC_URL="${PUBLIC_URL}" \n\
AUTH="${AUTH}" \n\
" > /app/config/.env
RUN npm run build

FROM nginx:1.17.9
ARG PUBLIC_URL

WORKDIR /app
COPY nginx/nginx.conf.template /etc/nginx/conf.d/default.conf.template
# argument to envsubst prevents $uri from being replaced (by empty text)
RUN PUBLIC_URL=${PUBLIC_URL} envsubst '${PUBLIC_URL}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf
COPY --from=builder /app/build /usr/share/nginx/html${PUBLIC_URL}
