const Discord = require('discord.js');
const Storage = require('../Storage');

const client = new Discord.Client({
  // some options
});

function run(ctx) {
  client.on('ready', () => {
    if (client.user.bot) {
      Storage.delete('token');
      ctx.gui.put(`{bold}Incorrect Token!{/bold} (Bot accounts cannot login as users)`);
    } else {
      ctx.gui.put(`{bold}Logged in as ${client.user.tag}{/bold}`, { center: true });
      ctx.allowInput = true;
    }
  });

  client.on('message', (message) => {
    if (message.channel !== ctx.current.channel) return;
    ctx.gui.putMessage(message);
  });

  client.login(Storage.get('token'))
    .catch((err) => {
      Storage.delete('token');
      ctx.gui.put(`{bold}Incorrect Token!{/bold} (${err.message})`);
    });
}

module.exports = { client, run };
