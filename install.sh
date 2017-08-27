#!/bin/bash

mkdir -p /usr/share/retrocord-light
cp -rf src/ /usr/share/retrocord-light
echo "node /usr/share/retrocord-light/src/index.js" > /usr/bin/retrocord-light
chmod +x /usr/bin/retrocord-light