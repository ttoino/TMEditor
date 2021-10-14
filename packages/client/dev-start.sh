#!/bin/bash

printf "\
PUBLIC_URL=$PUBLIC_URL \n\
AUTH=$AUTH \n\
FRONTEND_PORT=$FRONTEND_PORT \
HOST=$HOST \
" > config/.env

[ ! -d node_modules/ ] && echo "Installing dependencies" && npm i; npm run start
