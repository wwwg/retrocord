const Discord = require('discord.js');
const Storage = require('../Storage');
const timestamp = require('../util/timestamp');

const client = new Discord.Client({
  // some options
});

client.run = run;

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
    switch (message.channel.type) {
      case 'dm': {
        if (message.author.id === client.user.id) return;
        ctx.gui.put(`{yellow-fg}${timestamp(message.createdAt, false)}{/yellow-fg} {bold}${message.author.tag}{/bold} has sent you a message!`);
        break;
      }
      case 'group': {
        if (message.author.id === client.user.id) return;
        let dmName = message.channel.name === null ? 'Group' : message.channel.name;
        ctx.gui.put(`{yellow-fg}${timestamp(message.createdAt, false)}{/yellow-fg} {bold}${dmName} has a new message!`);
        break;
      }
      case 'text': {
        if (message.channel === ctx.current.channel) {
          ctx.gui.putMessage(message);
        } else if (message.mentions.users.has(client.user.id)) {
          ctx.gui.put(`{yellow-fg}${timestamp(message.createdAt, false)}{/yellow-fg} You were mentioned in {bold}${message.guild.name} #${message.channel.name}{/bold} by {bold}${message.author.tag}{/bold}`);
        }
        break;
      }
    }
  });

  client.login(Storage.get('token'))
    .catch((err) => {
      Storage.delete('token');
      ctx.gui.put(`{bold}Incorrect Token!{/bold} (${err.message})`);
    });
}

module.exports = { client, run };
