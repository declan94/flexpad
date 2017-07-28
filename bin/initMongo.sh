#!/bin/bash

MONGODB=flexpad
MONGOUSER=flexpad
MONGOPWD=cfflexpad

mongoQuery="db.creatUser({user: '$MONGOUSER', pwd: '$MONGOPWD', roles: [{role: 'readwrite', db: '$MONGODB'}]"
mongo <<< "$mongoQuery"