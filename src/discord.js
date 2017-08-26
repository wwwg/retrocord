const Discord = require('discord.js');
const ctx = require('./ctx');

const client = new Discord.Client({
  http: process.snekv ? {
    api: process.snekv.api,
    cdn: process.snekv.cdn,
    invite: process.snekv.invites,
  } : undefined,
});

client.run = ctx => {
  client.on('ready', () => {
    if (client.user.bot) {
      Storage.delete('token');
      client.destroy();
    } else {
      // {bold}Logged in as ${client.user.tag}{/bold}
      ctx.emit('login');
    }
  });

  client.login(ctx.token)
    .catch(e => {
      ctx.gui.put(`{bold}Token login error.{/bold} (${e.message})`);
    });
}

process.nextTick(() => {
  const Storage = require('./Storage');
  if (!Storage.has('token')) return;
  client.login(Storage.get('token'));
});

module.exports = client;
