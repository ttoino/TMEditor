#!/bin/bash

[ ! -d ../client-common/node_modules ] && echo "Installing dependencies" && yarn --cwd '../client-common'
[ ! -d node_modules/ ] && echo "Installing dependencies" && yarn; yarn run dev
