const Discord = require('discord.js');

const client = new Discord.Client({
  http: process.snekv ? {
    api: process.snekv.api,
    cdn: process.snekv.cdn,
    invite: process.snekv.invites,
  } : undefined,
});

client.run = run;

function run(ctx) {
  const Storage = require('./Storage');
  client.on('ready', () => {
    if (client.user.bot) {
      Storage.delete('token');
      ctx.gui.put(`{bold}Incorrect Token!{/bold} (Bot accounts cannot login as users)`);
    } else {
      ctx.gui.put(`{bold}Logged in as ${client.user.tag}{/bold}`, { center: true });
      ctx.allowInput = true;
      if (!Storage.has('completed_login')) {
        Storage.set('completed_login', true);
        ctx.gui.put('{bold}Use the join command to join a guild, dm, or channel{/bold} (/join discord api #general)');
      }
    }
  });

  client.on('message', (message) => {
    // if (message.channel === ctx.current.channel) {
    //   ctx.gui.putMessage(message);
    // } else if (message.author.id !== client.user.id) {
    //   switch (message.channel.type) {
    //     case 'dm': {
    //       // eslint-disable-next-line max-len
    //       ctx.gui.put(`{yellow-fg}${timestamp(message.createdAt, false)}{/yellow-fg} {bold}${message.author.tag}{/bold} has sent you a message!`);
    //       break;
    //     }
    //     case 'group': {
    //       const dmName = message.channel.name === null ? 'Group' : message.channel.name;
    //       // eslint-disable-next-line max-len
    //       ctx.gui.put(`{yellow-fg}${timestamp(message.createdAt, false)}{/yellow-fg} {bold}${dmName} has a new message!`);
    //       break;
    //     }
    //     case 'text': {
    //       if (!message.mentions.users.has(client.user.id)) return;
    //       // eslint-disable-next-line max-len
    //       ctx.gui.put(`{yellow-fg}${timestamp(message.createdAt, false)}{/yellow-fg} You were mentioned in {bold}${message.guild.name} #${message.channel.name}{/bold} by {bold}${message.author.tag}{/bold}`);
    //       break;
    //     }
    //   }
    // }
  });

  client.login(Storage.get('token'))
    .catch((err) => {
      Storage.delete('token');
      ctx.gui.put(`{bold}Incorrect Token!{/bold} (${err.message})`);
    });
}

module.exports = { client, run };
