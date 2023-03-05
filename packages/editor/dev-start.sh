#!/bin/bash

[ ! -d node_modules/ ] && echo "Installing dependencies" && yarn; yarn run dev
