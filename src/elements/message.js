const emoji = require('node-emoji');
const colors = require('ansi-256-colors');
const blessed = require('blessed');
const timestamp = require('../util/timestamp');
const hexToRgb = require('../util/hexToRgb');

module.exports = (message) => {
  const color = (...x) => {
    if (message.member) {
      const c = hexToRgb(message.member.displayHexColor);
      return colors.fg.getRgb(c.r, c.g, c.b) + x.join(' ') + colors.reset;
    } else {
      return colors.fg.getRgb(5, 5, 5) + x.join(' ') + colors.reset;
    }
  }

  let content = message.content;

  for (const mention of message.mentions.users.values()) {
    if (mention.id === client.user.id) {
      content = content.replace(new RegExp(`<@!?${mention.id}>`, 'g'), `{red+bold}@${client.user.username}{/}`);
      process.stdout.write('\x07');
    } else {
      content = content.replace(new RegExp(`<@!?${mention.id}>`, 'g'), `@${mention.username}`);
    }
  }

  for (const match of content.match(/:[^:]+:/g) || []) content = content.replace(match, emoji.get(match));

  return blessed.text({
    content: `{yellow}${timestamp(message.createdAt)}{/} ${color(message.author.tag)} ${content}`
  });
}
