const blessed = require('blessed');
const emoji = require('node-emoji');
const colors = require('ansi-256-colors');
const timestamp = require('../util/timestamp');
const hexToRgb = require('../util/hexToRgb');
const imageElement = require('./image');
const shortlink = require('../util/shortlink');
const Storage = require('../Storage');

async function messageElement(message, mdy = false) {
  const content = await legacy(message, mdy);
  return blessed.text({ content, tags: true });
}

async function legacy(message, mdy) {
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
  const time = `{yellow-fg}${timestamp(message.createdAt, mdy)}{/yellow-fg}`;
  switch (message.type) {
    case 'DEFAULT': {
      const ctx = require('../index.js');
      if (message.client.user.blocked.has(message.author.id)) {
        if (ctx.rc.blocked === 'true') return;
        return `${time} 1 Blocked message`;
      }
      let content = message.content.replace(/([^\s])(🏻|🏼|🏽|🏾|🏿)/g, (_, m) => m);

      for (const mention of message.mentions.users.values()) {
        content = content.replace(new RegExp(`<@!?${mention.id}>`, 'g'), `{blue-fg}@${mention.tag}{/blue-fg}`);
      }

      for (const mention of message.mentions.channels.values()) {
        content = content.replace(new RegExp(`<#${mention.id}>`, 'g'), `{blue-fg}#${mention.name}{/blue-fg}`);
      }

      for (const match of content.match(/:[^:]+:/g) || []) content = content.replace(match, emoji.get(match));

      if (message.mentions.includes && message.mentions.includes(message.client.user)) {
        process.stdout.write('\x07');
        content = `{yellow-bg}{black-fg}${content}{/black-fg}{/yellow-bg}`;
      }

      const IMAGE_RE = /(jpe?g|png|gif)$/;
      let files;
      if (Storage.rc.attachments !== 'false') {
        files = await Promise.all(message.attachments.map(async(a) => {
          let short = a.url.replace(/^.+?\/attachments\//, '').split('/');
          short = shortlink(short[2], short[0], short[1]);
          const i = IMAGE_RE.test(a.proxyURL);
          const ansi = i ?
            await imageElement({ id: a.id, url: a.proxyURL, width: a.width, height: a.height }) : null;
          return `${a.filename}${i ? ` (${a.width}x${a.height})` : ''} ${short}\n${ansi || ''}`.trim();
        }));
      }

      let attachments = [...files];

      if (!content) content = '{bold}(No Content){/bold}';
      if (attachments.length) attachments = `{bold}Attachments:{/bold} ${attachments.join('\n')}`;
      // eslint-disable-next-line max-len
      return `${time} ${color(message.author.tag)} ${content}\n${attachments}`.trim();
    }
    case 'RECIPIENT_ADD':
      // eslint-disable-next-line max-len
      return `${time} {green-fg}→{/green-fg} {bold}${message.author.tag}{/bold} added {bold}${message.mentions.users.first().tag}{/bold} to the group.`;
    case 'RECIPIENT_REMOVE':
      // eslint-disable-next-line max-len
      return `${time} {red-fg}←{/red-fg} {bold}${message.author.tag}{/bold} removed {bold}${message.mentions.users.first().tag}{/bold} from the group.`;
    case 'CALL':
      return `${time} {green-fg}📞{/green-fg} {bold}${message.author.tag}{/bold} started a call.`;
    case 'CHANNEL_NAME_CHANGE':
      // eslint-disable-next-line max-len
      return `${time} ✏️ {bold}${message.author.tag}{/bold} changed the channel name: {bold}${message.channel.name}{/bold}`;
    case 'CHANNEL_ICON_CHANGE':
      return `${time} ✏️ {bold}${message.author.tag}{/bold} changed the channel icon.`;
    case 'PINS_ADD':
      return `${time} 📌 {bold}${color(message.author.tag)}{/bold} pinned a message to this channel.`;
    case 'GUILD_MEMBER_JOIN':
      return `${time} {green-fg}→{/green-fg} {bold}${message.author.username}{/bold} has arrived!`;
    default:
      break;
  }
}

module.exports = messageElement;
