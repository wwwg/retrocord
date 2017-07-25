const emoji = require('node-emoji');
const colors = require('ansi-256-colors');
const timestamp = require('../util/timestamp');
const hexToRgb = require('../util/hexToRgb');
const imageElement = require('./image');

async function messageElement(message, mdy = false) {
  const client = message.client;
  const color = (...x) => {
    if (message.member) {
      let hex = message.member.displayHexColor;
      if (hex === '#000000') hex = '#FFFFFF';
      const c = hexToRgb(hex);
      return colors.fg.getRgb(c.r, c.g, c.b) + x.join(' ') + colors.reset;
    } else {
      return colors.fg.getRgb(5, 5, 5) + x.join(' ') + colors.reset;
    }
  };

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

  await message.attachments.map((x) => imageElement({
    id: x.id,
    url: x.proxyURL,
    width: x.width,
    height: x.height,
  }));

  return `{yellow-fg}${timestamp(message.createdAt, mdy)}{/yellow-fg} ${color(message.author.tag)} ${content}`;
}

module.exports = messageElement;
