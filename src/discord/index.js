const Discord = require('discord.js');
const Storage = require('../Storage');
const messageElement = require('../elements/message');

const client = new Discord.Client({
  // some options
});

function run(ctx) {
  client.on('ready', () => {
    ctx.gui.put(`{bold}Logged in as ${client.user.tag}{/bold}`, { center: true });
    ctx.allowInput = true;
  });

  client.on('message', (message) => {
    if (message.channel !== ctx.current.channel) return;
    messageElement(message).then((f) => ctx.gui.put(f));
  });

  client.login(Storage.get('token'))
    .catch((err) => {
      Storage.delete('token');
      ctx.gui.put(`{bold}Incorrect Token!{/bold} (${err.message})`);
    });
}

module.exports = { client, run };
