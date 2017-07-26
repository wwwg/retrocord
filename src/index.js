#!/usr/bin/env node

const emoji = require('node-emoji');
const Storage = require('./Storage');
const gui = require('./gui');
const commands = require('./commands');
const assets = require('./assets');
const discord = require('./discord');
const snekparse = require('snekparse');

const ctx = {
  gui, assets,
  discord: discord.client,
  allowInput: false,
  current: {
    scope: null,
    channel: null,
  },
  rc: Storage.getRc(),
};

gui.on('input', (message) => {
  if (message.startsWith(ctx.rc.prefix || '/')) {
    const [command, ...args] = message.slice(1).split(' ');
    if (command in commands) commands[command].run(ctx, snekparse(args));
  } else {
    if (!ctx.allowInput) return;
    const args = message.split(' ');
    for (const word in args) {
      if (args[word].startsWith('@')) {
        const [username, discrim] = args[word].split('#').map((x) => x.replace('@', '').toLowerCase());
        let user = ctx.discord.users.find((u) => {
          let match = false;
          if (u.username.replace(/ /g, '').toLowerCase() === username) match = true;
          if (discrim && u.discriminator !== discrim) match = false;
          return match;
        });
        if (user) args[word] = user.toString();
      }
    }
    message = args.join(' ');

    const customEmojis = getEmojis();
    for (const match of message.match(/:[^:]+:/g) || []) {
      if (customEmojis) {
        const found = customEmojis.find((x) => x.name.toLowerCase() === match.replace(/:/g, '').toLowerCase());
        message = message.replace(match, found ? found.toString() : null || emoji.get(match));
        if (!found) message = message.replace(match, emoji.get(match));
      } else {
        message = message.replace(match, emoji.get(match));
      }
    }

    if (ctx.current.channel) ctx.current.channel.send(message);
  }
});

gui.init();
gui.put(`{center}${assets.logo}{/center}`, { center: true });

if (Storage.has('token')) {
  discord.run(ctx);
} else {
  gui.put('{bold}Please Login!{/bold}', { center: true });
}

function getEmojis() {
  if (ctx.discord.user && ctx.discord.user.premium) {
    return ctx.discord.emojis;
  } else if (ctx.current.scope && ctx.current.scope !== 'dm') {
    return ctx.current.scope.emojis;
  } else {
    return null;
  }
}

process.on('unhandledRejection', handleError);
process.on('uncaughtException', handleError);

function handleError(e) {
  ctx.gui.put(`{red-fg}{bold}Unhandled Error (You should report this){/bold}{/red-fg}\n${e.stack}\n {red-fg}{bold}-- End Error --{/bold}{/red-fg}`);
}
