const EventEmitter = require('events'),
  blessed = require('blessed'),
  timestamp = require('./util/timestamp');

class GUI extends EventEmitter {
  constructor(screen) {
    super();
    this.screen = screen;
    this.chatbox = blessed.box({
      label: 'Retrocord Light',
      width: '100%',
      height: '100%-1',
      border: { type: 'line' },
    });

    this.consolebox = blessed.log({
      parent: this.chatbox,
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

    this.screen.append(this.chatbox);
    this.screen.append(this.inputbox);
    this.screen.render();

    this.inputbox.focus();
  }
  put(text) {
    this.consolebox.log(text);
  }
  putMessages(messages) {
    const me = this;
    messages.forEach(m => {
      const ts = timestamp(m.createdAt),
        arrow = (m.author.id == ctx.discord.user.id) ? `{green-fg}{bold}↩{/bold}{/green-fg}` : `{green-fg}{bold}↪{/bold}{/green-fg}`,
        txt = `${arrow} {yellow-fg}{bold}${ts}{/bold}{/yellow-fg} {white-fg}{bold}${m.author.username}{/bold}{/white-fg} : ${m.content}`;
      me.put(txt);
    });
  }
  putMessage(message, opt) {
    return this.putMessages([message], opt);
  }
  putTypingStart(channel, user) {
    me.put(`{yellow-fg}{bold}↪{/bold}{/yellow-fg} {white-fg}{bold}${user.username}{/bold} has {green-fg}started{/green-fg} typing.`);
  }
  putTypingStop(channel, user) {
    me.put(`{yellow-fg}{bold}↪{/bold}{/yellow-fg} {white-fg}{bold}${user.username}{/bold} has {red-fg}stopped{/red-fg} typing.`);
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
});

const gui = new GUI(screen);

module.exports = gui;
