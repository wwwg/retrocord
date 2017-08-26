const blessed = require('blessed');
const parseMessage = require('../lib/parseMessage');

function MessageContent(message) {
  const items = parseMessage(message);
  var mentionsClient = false;
  if (message.mentions.members) {
    mentionsClient = message.mentions.members.array().includes(message.client.user);
  }
  if (mentionsClient) process.stdout.write('\x07');
  return blessed.element({
    children: items.map((item) =>
      blessed.box({
        tags: !!item.style,
        style: item.style,
        content: item.content || item,
      })),
  });
}

module.exports = MessageContent;
