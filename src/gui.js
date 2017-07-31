const EventEmitter = require('events');
const blessed = require('blessed');
const messageElement = require('./elements/message');

class GUI extends EventEmitter {
  constructor(screen) {
    super();
    this.screen = screen;
    this.mainbox = blessed.box({
      label: 'retrocord',
      width: '100%',
      height: '100%-1',
      border: { type: 'line' },
    });

    this.chatbox = blessed.box({
      parent: this.mainbox,
      tags: true,
      scrollable: true,
      label: '',
      alwaysScroll: true,
      scrollbar: {
        ch: '',
        inverse: true,
      },
      mouse: true,
    });

    this.inputbox = blessed.textbox({
      bottom: 0,
      width: '100%',
      height: 1,
      inputOnFocus: true,
    });

    this.awaitingResponse = false;
  }

  init() {
    this.inputbox.key('enter', () => {
      if (this.awaitingResponse) this.emit('internalInput', this.inputbox.getValue());
      else this.emit('input', this.inputbox.getValue());
      this.inputbox.clearValue();
      this.inputbox.focus();
      this.screen.render();
    });

    this.screen.append(this.mainbox);
    this.screen.append(this.inputbox);
    this.screen.render();

    this.inputbox.focus();
  }

  put(content) {
    const element = blessed.box({ content });
    // element.setContent(content);
    this.chatbox.append(element);
  }

  async putMessages(messages, { mdy = false } = {}) {
    messages = await Promise.all(messages.map((m) => messageElement(m, mdy)));
    for (const message of messages) this.chatbox.append(message);
    this.screen.render();
  }

  putMessage(message, opt) {
    return this.putMessages([message], opt);
  }

  awaitResponse(text) {
    this.awaitingResponse = true;
    return new Promise((resolve) => {
      this.put(text);
      this.once('internalInput', (input) => {
        this.awaitingResponse = false;
        resolve(input);
      });
    });
  }
}

const screen = blessed.screen({
  smartCSR: true,
  title: 'retrocord',
  fullUnicode: true,
  dockBorders: true,
});

const gui = new GUI(screen);

module.exports = gui;
