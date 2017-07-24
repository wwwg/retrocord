const EventEmitter = require('events');
const blessed = require('blessed');
const format = require('./util/format');

class GUI extends EventEmitter {
  constructor(screen) {
    super();
    this.screen = screen;
    this.chatbox = blessed.box({
      label: 'retrocord',
      width: '100%',
      height: '100%-1',
      border: { type: 'line' }
    });

    this.consolebox = blessed.log({
      parent: this.chatbox,
      tags: true,
      scrollable: true,
      label: '',
      alwaysScroll: true,
      scrollbar: {
        ch: '',
        inverse: true
      },
      mouse: true,
    });

    this.inputbox = blessed.textbox({
      bottom: 0,
      width: '100%',
      height: 1,
      inputOnFocus: true,
      // border: { type: 'bg' }
    });
  }

  init() {
    this.inputbox.key('enter', () => {
      this.emit('input', this.inputbox.getValue());
      this.inputbox.clearValue();
      this.inputbox.focus();
      this.screen.render();
    });

    this.screen.append(this.chatbox);
    this.screen.append(this.inputbox);
    this.screen.render();

    this.inputbox.focus();
  }

  put(text, options = {}) {
    this.consolebox.log(format(text, {
      width: this.consolebox.width,
      center: options.center,
    }));
  }
}

const screen = blessed.screen({
  smartCSR: true,
  title: 'retrocord'
});

const gui = new GUI(screen);

module.exports = gui;
