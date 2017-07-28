#!/bin/bash

set -u
set -e

#Was this script started in the bin folder? if yes move out
if [ -d "../bin" ]; then
  cd "../"
fi

npm install
npm install bower

cd public
../node_modules/bower/bin/bower install $1