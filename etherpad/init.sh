#!/bin/bash

MYSQL_ROOT_USER="root"
MYSQL_ROOT_PWD=""

EP_DB="etherpad-lite"
EP_USER="etherpad"
EP_PWD="cloudfortep"

MYSQL_SCRIPT="create database \`${EP_DB}\`;"
MYSQL_SCRIPT="$MYSQL_SCRIPT grant CREATE,ALTER,SELECT,INSERT,UPDATE,DELETE on \`${EP_DB}\`.* to '${EP_USER}'@'localhost' identified by '${EP_PWD}';"

mysql -u$MYSQL_ROOT_USER -p$MYSQL_ROOT_PWD <<< "$MYSQL_SCRIPT"


