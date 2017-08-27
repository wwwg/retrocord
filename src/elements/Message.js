const blessed = require('blessed');

const Timestamp = require('./Timestamp');
const UserTag = require('./UserTag');
const MessageContent = require('./MessageContent');

function Message(message) {
  if (message.type === 'DEFAULT') {
    return blessed.element({
      children: [
        Timestamp(message.createdAt),
        UserTag({
            member: message.member,
            user: message.author
          }),
        MessageContent(message),
      ],
    });
  }
  return blessed.element({
    children: [
      new Timestamp({ date: message.createdAt }),
      new MessageContent({ message }),
    ],
  });
}

module.exports = Message;
