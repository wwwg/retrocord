#!/usr/bin/env node

require('./util/jsx');
const snekparse = require('snekparse');
process.snekv = snekparse(process.argv);

const Storage = require('./Storage');
const assets = require('./assets');
const discord = require('./discord');
const commands = require('./commands');

const ctx = module.exports = {
  assets,
  discord: discord.client,
  current: {
    scope: null,
    channel: null,
  },
  rc: Storage.rc,
};

const gui = ctx.gui = require('./gui');

gui.cork();
gui.on('input', (content) => {
  const prefix = Storage.rc.prefix || '/';
  if (content.startsWith(prefix)) {
    const [command, ...args] = content.slice(prefix.length).split(' ');
    if (command in commands) commands[command].run(ctx, snekparse(args));
  } else {
    // handle message
  }
});

gui.put(`{center}${assets.logo}{/center}`);

if (Storage.has('token')) {
  discord.run(ctx);
} else {
  gui.put('{bold}Please Login!{/bold}', { center: true });
  if (!Storage.has('completed_login')) gui.put('{bold}Use the login command{/bold} (/login <token>)');
}
