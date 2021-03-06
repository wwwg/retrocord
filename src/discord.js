const Discord = require('discord.js'),
  client = new Discord.Client();

client.run = ctx => {
  client.on('ready', () => {
    if (client.user.bot) {
      client.destroy();
    } else {
      ctx.gui.put(`{green-fg}➜{/green-fg} Logged in as {bold}{yellow-fg}${client.user.tag}{/yellow-fg} {green-fg}✓{/green-fg}{/bold}`);
      ctx.gui.put('{green-fg}➜{/green-fg} Use the join command to join a guild, dm, or channel (:join discord api #general)');
    }
  });
  client.on('message', msg => {
    if (ctx.current.channel && msg.channel.id === ctx.current.channel.id) {
      ctx.gui.putMessage(msg);
    }
  }).on('typingStart', (channel, user) => {
    if (ctx.current.channel && channel.id === ctx.current.channel.id) {
      ctx.gui.putTypingStart(channel, user);
      ctx.dmIsTyping = true;
    }
  }).on('typingStop', (channel, user) => {
    if (ctx.current.channel && channel.id === ctx.current.channel.id) {
      ctx.gui.putTypingStop(channel, user);
      ctx.dmIsTyping = false;
    }
  });
  client.login(ctx.token)
    .catch(e => {
      ctx.gui.put(`{bold}Login error:{/bold} ${e.message}.`);
      ctx.gui.put('Try using the :login <token> command to log in.');
    });
}
module.exports = client;