#!/bin/bash

sudo mkdir -p /usr/share/retrocord-light
sudo cp -rf src/ /usr/share/retrocord-light
npm i
sudo cp -rf node_modules/ /usr/share/retrocord-light/node_modules/
sudo sh -c "echo \"node /usr/share/retrocord-light/src/index.js\" > /usr/bin/retrocord-light"
sudo chmod +x /usr/bin/retrocord-light
