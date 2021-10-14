#!/bin/bash

[ ! -d node_modules/ ] && echo "Installing dependencies" && npm i; npm run dev