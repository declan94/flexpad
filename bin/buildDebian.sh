#!/usr/bin/env bash

# IMPORTANT 
# Protect agaisnt mispelling a var and rm -rf /
set -u
set -e

#Was this script started in the bin folder? if yes move out
if [ -d "../bin" ]; then
  cd "../"
fi

SRC=/tmp/flexpad-deb-src
DIST=/tmp/flexpad-deb-dist
SYSROOT=${SRC}/sysroot
DEBIAN=${SRC}/DEBIAN

sudo rm -rf ${DIST}
mkdir -p ${DIST}/

sudo rm -rf ${SRC}
rsync -a bin/deb-src/ ${SRC}/
mkdir -p ${SYSROOT}/opt/

rsync --exclude '.git' -a . ${SYSROOT}/opt/flexpad/ --delete
sudo find ${SRC}/ -type d -exec chmod 0755 {} \;
sudo find ${SRC}/ -type f -exec chmod go-w {} \;
sudo chown -R root:root ${SRC}/

let SIZE=`sudo du -s ${SYSROOT} | sudo sed s'/\s\+.*//'`+8
pushd ${SYSROOT}/
sudo tar czf ${DIST}/data.tar.gz [a-z]*
popd
sudo sed s"/SIZE/${SIZE}/" -i ${DEBIAN}/control
pushd ${DEBIAN}
sudo tar czf ${DIST}/control.tar.gz *
popd

pushd ${DIST}/
sudo echo 2.0 > ./debian-binary

sudo find ${DIST}/ -type d -exec chmod 0755 {} \;
sudo find ${DIST}/ -type f -exec chmod go-w {} \;
sudo chown -R root:root ${DIST}/
sudo ar r ${DIST}/flexpad-0.0.1.deb debian-binary control.tar.gz data.tar.gz
popd
rsync -a ${DIST}/flexpad-0.0.1.deb ../
