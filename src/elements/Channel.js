const blessed = require('blessed');
const ctx = require('../ctx');

const Message = require('./Message');

function Channel() {
  return blessed.list({
    interactive: false,
    mouse: true,
    children: getMessages().map((message) => new Message({ message })),
  });
}

function getMessages() {
  const channel = ctx.current.channel;
  if (!channel) return [];
  return channel.messages.array();
}

module.exports = Channel;
