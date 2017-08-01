const React = require('react');
const PropTypes = require('prop-types');
const UserTag = require('./UserTag');

const {
  // EVERYONE_PATTERN,
  USERS_PATTERN,
  CHANNELS_PATTERN,
  ROLES_PATTERN,
} = require('discord.js').MessageMentions;

class MessageContent extends React.Component {
  constructor(props) {
    super(props);
    const message = this.props.message;
    this.items = makeItems(message);
    this.mentionsClient = message.mentions.has(message.client.user);
    if (this.mentionsClient) process.stdout.write('\x07');
  }

  render() {
    const prefix = this.mentionsClient ? '{yellow-bg}{black-fg}' : '';
    const suffix = this.mentionsClient ? '{/black-fg}{/yellow-bg}' : '';
    return (
      <element>
        <box>{prefix}</box>
        {this.items.map((item, i) => {
          if (item.isValidElement) return item;
          return <box key={i} tags={!!item.style} style={item.style || {}}>{item.content ? item.content : item}</box>;
        })}
        <box>{suffix}</box>
      </element>
    );
  }
}

MessageContent.propTypes = {
  message: PropTypes.object.isRequired,
};

function makeItems(message) {
  const client = message.client;
  const authorTag = React.createElement(UserTag, {
    user: message.author,
    member: message.member,
    bold: true,
  });
  switch (message.type) {
    case 'DEFAULT': {
      if (client.user.blocked.has(message.author.id)) return ['1 Blocked Message'];
      const items = [];
      let parts = message.content.split(' ');
      for (const part of parts) {
        if (USERS_PATTERN.test(part)) {
          const id = part.match(USERS_PATTERN)[1];
          const user = client.users.get('id');
          items.push({
            content: user ? `@${user.tag}` : `<@${id}>`,
            style: { fg: 'blue' },
          });
        } else if (CHANNELS_PATTERN.test(part)) {
          const id = part.match(CHANNELS_PATTERN)[1];
          const channel = client.channels.get(id);
          items.push({
            content: channel ? `#${channel.name}` : '#deleted-channel',
            style: { fg: 'blue' },
          });
        } else if (ROLES_PATTERN.test(part)) {
          if (!message.guild) return;
          const id = part.match(ROLES_PATTERN)[1];
          const role = message.guild.roles.get(id);
          items.push({
            content: role ? `@${role.name}` : '@deleted-role',
            tyle: { fg: 'blue' },
          });
        } else {
          items.push(part);
        }
      }
      return items;
    }
    case 'RECIPIENT_ADD':
      return [
        { content: '→', style: { fg: 'green' } },
        authorTag,
        'added',
        React.createElement(UserTag, { user: message.mentions.users.first(), bold: true }),
        'to the group.',
      ];
    case 'RECIPIENT_REMOVE':
      return [
        { content: '←', style: { fg: 'red' } },
        authorTag,
        'added',
        React.createElement(UserTag, { user: message.mentions.users.first(), bold: true }),
        'to the group.',
      ];
    case 'CALL':
      return [
        '📞',
        authorTag,
        'started a call.',
      ];
    case 'CHANNEL_NAME_CHANGE':
      return [
        '✏️',
        authorTag,
        'changed the channel name:',
        { content: message.channel.name, style: { bold: true } },
      ];
    case 'CHANNEL_ICON_CHANGE':
      return [
        '✏️',
        authorTag,
        'changed the channel icon.',
      ];
    case 'PINS_ADD':
      return [
        authorTag,
        'pinned a message to this channel.',
      ];
    case 'GUILD_MEMBER_JOIN':
      return [
        { content: '→', style: { fg: 'green' } },
        { content: message.author.username, style: { bold: true } },
        'has arrived',
      ];
    default:
      break;
  }
}

module.exports = MessageContent;
