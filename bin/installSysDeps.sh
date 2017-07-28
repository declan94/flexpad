#!/bin/bash

sudo apt-get update
sudo apt-get install -y unzip gzip git curl python libssl-dev pkg-config build-essential mongodb
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash - 
sudo apt-get install -y nodejs