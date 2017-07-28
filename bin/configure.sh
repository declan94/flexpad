#!/bin/bash

# configure etherpad and flexpad

set -u
set -e

# make sure mysql and mongodb started
/etc/init.d/mysql start
/etc/init.d/mongodb start || /etc/init.d/mongod start

#Was this script started in the bin folder? if yes move out
if [ -d "../bin" ]; then
  cd "../"
fi

echo "[Configure etherpad]"
echo "Configure mysql database for etherpad"
./etherpad/initMysql.sh

echo "Copy etherpad settings file"
sudo cp ./etherpad/settings.json /opt/etherpad/
sudo chown etherpad /opt/etherpad/settings.json

echo "Restart etherpad"
sudo service etherpad restart

echo "[Configure flexpad]"
echo "Configure mongodb for flexpad"
./bin/initMongo.sh

