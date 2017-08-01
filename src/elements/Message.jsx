const React = require('react');
const PropTypes = require('prop-types');
const Timestamp = require('./Timestamp');
const UserTag = require('./UserTag.jsx');
const MessageContent = require('./MessageContent.jsx');

class Message extends React.Component {
  render() {
    const message = this.props.message;
    if (message.type === 'DEFAULT') return DefaultMessage(message);
    return OtherMessage(message);
  }
}

function DefaultMessage(message) {
  return (
    <element>
      <Timestamp date={message.createdAt} />
      <UserTag user={message.author} member={message.member} />
      <MessageContent message={message} />
    </element>
  );
}

function OtherMessage(message) {
  return (
    <element>
      <Timestamp date={message.createdAt} />
      <MessageContent message={message} />
    </element>
  );
}

Message.propTypes = {
  message: PropTypes.object.isRequired,
};

module.exports = Message;
