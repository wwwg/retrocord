const EventEmitter = require('events');
const React = require('react');
const { render } = require('react-blessed');
const blessed = require('blessed');

const refs = {
  chatbox: null,
  inputbox: null,
};

class App extends React.Component { // eslint-disable-line no-unused-vars
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
            ref={(x) => { refs.chatbox = x; }}></box>
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
