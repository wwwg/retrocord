#!/usr/bin/env node

const snekparse = require('snekparse');
process.snekv = snekparse(process.argv);

const emoji = require('node-emoji');
const Storage = require('./Storage');
const gui = require('./gui');
const commands = require('./commands');
const assets = require('./assets');
const discord = require('./discord');
const lookup = require('./util/lookup');

const ctx = {
  gui, assets,
  discord: discord.client,
  allowInput: false,
  current: {
    scope: null,
    channel: null,
  },
  rc: Storage.rc,
};

module.exports = ctx;

gui.on('input', (message) => {
  if (!message.length) return;
  const prefix = ctx.rc.prefix || '/';
  if (message.startsWith(prefix)) {
    const [command, ...args] = message.slice(prefix.length).split(' ');
    if (command in commands) commands[command].run(ctx, snekparse(args));
  } else {
    if (!ctx.allowInput) return;
    const args = message.split(' ');
    for (const word in args) {
      if (args[word].startsWith('@')) {
        const users = ctx.current.scope && ctx.current.scope !== 'dm' ?
          ctx.current.scope.members.map((m) => m.user) :
          ctx.discord.users;
        const user = lookup.user(args[word].slice(1), users);
        if (user) args[word] = user.toString();
      } else if (args[word].startsWith('#')) {
        if (!ctx.current.scope || ctx.current.scope === 'dm') continue;
        const name = args[word].slice(1);
        const channel = ctx.current.scope.channels
          .filter((c) => c.type === 'text')
          .find((c) =>
            c.name.toLowerCase() === name.toLowerCase());
        if (channel) args[word] = channel.toString();
      }
    }
    message = args.join(' ');

    const customEmojis = getEmojis();
    for (const match of message.match(/:[^:]+:/g) || []) {
      const unicode = emoji.get(match);
      if (unicode !== match) {
        message = message.replace(match, unicode);
        continue;
      }
      const found = customEmojis.find((x) => x.name.toLowerCase() === match.replace(/:/g, '').toLowerCase());
      message = message.replace(match, found ? found.toString() : emoji.get(match));
    }

    if (ctx.current.channel) {
      ctx.current.channel.send(message).catch((err) => {
        ctx.gui.put(`{bold}${err.message}{/bold}`);
      });
    }
  }
});

gui.init();
gui.put(`{center}${assets.logo}{/center}`, { center: true });

if (Storage.has('token')) {
  discord.run(ctx);
} else {
  gui.put('{bold}Please Login!{/bold}', { center: true });
  if (!Storage.has('completed_login')) gui.put('{bold}Use the login command{/bold} (/login <token>)');
}

function getEmojis() {
  if (ctx.discord.user && ctx.discord.user.premium) {
    return ctx.discord.emojis;
  } else if (ctx.current.scope && ctx.current.scope !== 'dm') {
    return ctx.current.scope.emojis;
  } else {
    return [];
  }
}

process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

function handleError(e) {
  ctx.gui.put(`{red-fg}{bold}Unhandled Error (You should report this){/bold}{/red-fg}\n${e.stack}
 {red-fg}{bold}-- End Error --{/bold}{/red-fg}`);
}
