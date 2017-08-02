const React = require('react');

const MessageComponent = require('./Message.jsx');

const ctx = require('../ctx');
const discord = require('../discord');

class Channel extends React.Component {
  constructor(props) {
    super(props);

    this.state = { messages: [] };

    discord.on('message', ({ channel }) => {
      if (channel === ctx.current.channel) this.updateMessages();
    });
  }

  render() {
    return (
      <list interactive={false}
        mouse={true}>
        {this.state.messages.map((message) => <MessageComponent key={message.id} message={message}/>)}
      </list>
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
