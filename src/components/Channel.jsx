const React = require('react');

const ctx = require('../ctx');

const MessageComponent = require('./Message.jsx');

class Channel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { messages: [] };
  }

  render() {
    return (
      <box tags={true}
        scrollable={true}
        alwaysScroll={true}
        mouse={true}
        scrollbar={{ ch: '', inverse: true }}>
        {this.state.messages.map((message) => <MessageComponent key={message.id} message={message}/>)}
      </box>
    );
  }

  componentWillMount() {
    this.updateMessages();
  }

  updateMessages() {
    const channel = ctx.current.channel;
    if (!channel) return;
    this.setState({
      messages: channel.messages.array(),
    });
  }
}

module.exports = Channel;
