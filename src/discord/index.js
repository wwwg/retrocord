const Discord = require('discord.js');
const Storage = require('../Storage');
const messageElement = require('../elements/message');

const client = new Discord.Client({
  // some options
});

function run(ctx) {
  client.on('ready', () => {
    ctx.gui.put(`Logged in as ${client.user.tag}`, { center: true });
    ctx.allowInput = true;
  });

  client.on('message', (message) => {
    ctx.gui.put(message.content);
    // ctx.gui.put(messageElement(message));
  });

  client.login(Storage.get('token'))
  .catch((err) => {
    Storage.delete('token');
    ctx.gui.put(`{red+bold}Incorrect Token!{/} (${err.message})`);
  });
}

module.exports = { client, run };
