const EventEmitter = require('events');
const React = require('react');
const { render } = require('react-blessed');
const blessed = require('blessed');

const MessageElement = require('./elements/Message.jsx');

const refs = {
  chatbox: null,
  inputbox: null,
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { messages: [] };

    const ctx = require('./index');
    ctx.discord.on('message', () => {
      const messages = ctx.current && ctx.current.channel ?
        ctx.current.channel.messages.array() : [];
      this.setState({ messages });
    });
  }

  render() {
    return (
      <element>
        <box label='retrocord'
          border={{ type: 'line' }}
          width='100%'
          height='100%-1'>
          <box tags={true}
            scrollable={true}
            alwaysScroll={true}
            mouse={true}
            scrollbar={{ ch: '', inverse: true }}
            ref={(x) => { refs.chatbox = x; }}>
            {this.state.messages.map((message) => <MessageElement key={message.id} message={message}/>)}
          </box>
        </box>
        <textbox bottom={0}
          width='100%'
          height={1}
          inputOnFocus={true}
          ref={(x) => { refs.inputbox = x; }}></textbox>
      </element>
    );
  }
}

const screen = blessed.screen({
  autoPadding: true,
  smartCSR: true,
  title: 'retrocord',
  dockBorders: true,
  fullUnicode: true,
});

class GUI extends EventEmitter {
  constructor() {
    super();
    this.root = render(<App />, screen);

    this.awaitingResponse = false;
    this.corked = false;

    refs.inputbox.key('enter', () => {
      const value = refs.inputbox.getValue();
      if (value) {
        if (this.awaitingResponse) this.emit('internalInput', value);
        else this.emit('input', value);
      }
      refs.inputbox.clearValue();
      refs.inputbox.focus();
      screen.render();
    });

    refs.inputbox.focus();
  }

  put(content) {
    refs.chatbox.append(blessed.box({ content, tags: true }));
  }

  cork() {
    this.corked = true;
  }

  uncork() {
    this.corked = false;
  }
}

module.exports = new GUI();
module.exports.refs = refs;
