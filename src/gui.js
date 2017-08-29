const EventEmitter = require('events'),
  blessed = require('blessed'),
  timestamp = require('./util/timestamp');

class GUI extends EventEmitter {
  constructor(screen) {
    super();
    this.screen = screen;
    this.chatbox = blessed.box({
      label: 'Retrocord Light',
      left: '0.5%',
      width: '86%',
      height: '96%-1',
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'white'
        }
      }
    });
    this.infobox = blessed.textbox({
      label: 'Info',
      left: '86%',
      width: '14%',
      height: '96%-1',
      border: {
        type: "line"
      },
      style: {
        border: {
          fg: "white"
        }
      }
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
      mouse: true
    });
    this.inputbox = blessed.textbox({
      bottom: 0,
      width: '100%',
      height: 3,
      inputOnFocus: true,
      border: {
        type: 'line'
      },
      style: {
        border: {
          fg: 'grey'
        }
      }
    });
    this.infolog = blessed.log({
      parent: this.infobox,
      tags: true,
      scrollable: true,
      label: '',
      alwaysScroll: true,
      scrollbar: {
        ch: '',
        inverse: true,
      },
      mouse: true
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
    this.screen.append(this.infobox);
    this.screen.render();
    this.inputbox.focus();
  }
  put(text) {
    this.consolebox.log(text);
  }
  puti(txt) {
    this.infolog.log(txt);
  }
  putMessages(messages) {
    const me = this;
    messages.forEach(m => {
      const ts = timestamp(m.createdAt),
        arrow = (m.author.id == ctx.discord.user.id) ? `{green-fg}{bold}↩{/bold}{/green-fg}` : `{green-fg}{bold}↪{/bold}{/green-fg}`,
        txt = `${arrow} {yellow-fg}{bold}${ts}{/bold}{/yellow-fg} {white-fg}{bold}${m.author.username}{/bold}{/white-fg} ${m.content}`;
      me.put(txt);
    });
  }
  putMessage(message, opt) {
    return this.putMessages([message], opt);
  }
  putTypingStart(channel, user) {
    this.put(`{blue-fg}{bold}↷{/bold}{/blue-fg} {white-fg}{bold}${user.username}{/bold}{/white-fg} has {green-fg}started{/green-fg} typing.`);
  }
  putTypingStop(channel, user) {
    this.put(`{blue-fg}{bold}↶{/bold}{/blue-fg} {white-fg}{bold}${user.username}{/bold}{/white-fg} has {red-fg}stopped{/red-fg} typing.`);
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
