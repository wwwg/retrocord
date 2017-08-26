#!/usr/bin/env node

const emoji = require('node-emoji'),
  Storage = require('./Storage'),
  snekparse = require('snekparse'),
  gui = require('./gui'),
  commands = require('./commands'),
  lookup = require('./util/lookup'),
  fs = require('fs'),
  home = require('./lib/home'),
  EventEmitter = require('events'),
  getEmojis = () => {
    if (ctx.discord.user && ctx.discord.user.premium) {
      return ctx.discord.emojis;
    } else if (ctx.current.scope && ctx.current.scope !== 'dm') {
      return ctx.current.scope.emojis;
    } else {
      return [];
    }
  }, onErr = e => {
    ctx.gui.put(`{red-fg}{bold}JavaScript Exception:{/bold}{/red-fg}\n${e.stack}
    {red-fg}{bold}-- End Error --{/bold}{/red-fg}`);
  },
  tokenFile = home() + '/.rtoken';

class Context extends EventEmitter {
  constructor(gui) {
    super();
    this.gui = gui;
    this.discord = require('./discord');
    this.allowInput = false;
    this.current = {
      scope: null,
      channel: null,
    };
  }
}
const ctx = new Context(gui);

gui.on('input', (message) => {
  if (message.length == 0) return;
  if (message.startsWith(':')) {
    const [command, ...args] = message.slice(1).split(' ');
    if (commands[command]) {
      commands[command].run(ctx, snekparse(args));
    }
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
gui.put(`{center}Retrocord Light{/center}`, { center: true });
gui.put('{bold}Welcome to Retrocord Light.{/bold}', { center: true });

fs.stat(tokenFile, (err, stats) => {
  if (err) {
    // No token file in home dir
    gui.put('Use :login <token> to login to your account.');
  } else {
    // Auto login with found token file
    fs.readFile(tokenFile, 'utf8', (err, data) => {
      if (err) {
        throw err;
        return;
      } else {
        ctx.token = data;
        ctx.discord.run(ctx);
      }
    });
  }
})

process.on('unhandledRejection', onErr);
process.on('uncaughtException', onErr);
module.exports = ctx;