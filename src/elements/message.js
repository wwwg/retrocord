const emoji = require('node-emoji');
const colors = require('ansi-256-colors');
const timestamp = require('../util/timestamp');
const hexToRgb = require('../util/hexToRgb');
const imageElement = require('./image');
const shortlink = require('../util/shortlink');

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
      content = content.replace(new RegExp(`<@!?${mention.id}>`, 'g'), `{red-fg}{bold}@${client.user.username}{/bold}{/red-fg}`);
      process.stdout.write('\x07');
    } else {
      content = content.replace(new RegExp(`<@!?${mention.id}>`, 'g'), `@${mention.username}`);
    }
  }

  for (const match of content.match(/:[^:]+:/g) || []) content = content.replace(match, emoji.get(match));

  let images = await Promise.all(message.attachments.map(async (a) => {
    const short = a.url.replace('https://cdn.discordapp.com/attachments/', '').split('/');
    const ansi = await imageElement({ id: a.id, url: a.proxyURL, width: a.width, height: a.height });
    return `${a.filename} (${a.width}x${a.height}) ${shortlink(short[2], short[0], short[1])}\n${ansi}`;
  }));

  let attachments = [...images];

  if (!content) content = '{bold}(No Content){/bold}';
  if (attachments.length) attachments = `{bold}Attachments:{/bold} ${attachments.join('\n')}`;
  return `{yellow-fg}${timestamp(message.createdAt, mdy)}{/yellow-fg} ${color(message.author.tag)} ${content}\n${attachments}`.trim();
}

module.exports = messageElement;
