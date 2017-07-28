#!/bin/bash

MONGODB=flexpad
MONGOUSER=flexpad
MONGOPWD=cfflexpad

set -u
set -e

echo "db.createUser({user: '$MONGOUSER', pwd: '$MONGOPWD', roles: ['readWrite']});" | mongo $MONGODB
