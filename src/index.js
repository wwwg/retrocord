#!/usr/bin/env node

require('./util/jsx');
const snekparse = require('snekparse');
process.snekv = snekparse(process.argv);

const Storage = require('./Storage');
const assets = require('./assets');
const gui = require('./gui');

gui.cork();

gui.on('input', (content) => {
  const prefix = Storage.get('prefix') || '/';
  if (content.startsWith(prefix)) {
    // handle command
  } else {
    // handle message
  }
})

gui.put(`{center}${assets.logo}{/center}`);
