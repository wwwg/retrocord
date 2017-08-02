const React = require('react');
const PropTypes = require('prop-types');
const parseMessage = require('../lib/parseMessage');

class MessageContent extends React.Component {
  constructor(props) {
    super(props);
    const message = this.props.message;
    this.items = parseMessage(message);
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

module.exports = MessageContent;
