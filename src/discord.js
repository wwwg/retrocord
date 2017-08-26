const Discord = require('discord.js'),
  client = new Discord.Client;

client.run = ctx => {
  client.on('ready', () => {
    if (client.user.bot) {
      client.destroy();
    } else {
      // {bold}Logged in as ${client.user.tag}{/bold}
      ctx.emit('login');
    }
  });

  client.login(ctx.token)
    .catch(e => {
      ctx.gui.put(`{bold}Login error{/bold} (${e.message})`);
    });
}
module.exports = client;