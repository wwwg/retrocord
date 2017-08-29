const EventEmitter = require('events'),
  blessed = require('blessed'),
  timestamp = require('./util/timestamp'),
  Discord = require('discord.js');

class GUI extends EventEmitter {
  constructor(screen) {
    super();
    this.history = []; // For storing past messages
    this.historyAt = 1; // For indexing history
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
  renderInfo() {
    if (global.ctx && ctx.discord && ctx.discord.user) {
      const uname = ctx.discord.user.tag,
        friendCount = ctx.discord.user.friends.array().length,
        friends = ctx.discord.user.friends,
        isInDm = ctx.current.channel ? (ctx.current.channel instanceof Discord.DMChannel) : false,
        listSize = friendCount > 24 ? 25 : friendCount;
      let txt = `
      {yellow-fg}{bold}${uname}{/bold}{/yellow-fg}
      `;
      if (isInDm) {
        txt += `\n{center}DM:\n{white-fg}{bold}${ctx.current.channel.recipient.username}{/white-fg}{/bold}{/center}`;
        if (ctx.dmIsTyping) {
          txt += `\n{center}{underline}{white-fg}is typing...{/white-fg}{/underline}{/center}`;
        }
        txt += `\n{underline}Status: {bold}${ctx.current.channel.recipient.presence.status}{/underline}{/center}\n`;
      }
      if (!ctx.hideFriends) {
        txt += "\nFriends:";
        var fs = friends.array();
        var chns = ctx.discord.channels.filterArray(c => c.type === 'dm');
        // /*
        chns.sort((a, b) => {
          if (!a.recipient.lastMessage || !b.recipient.lastMessage) return -1;
          return (b.recipient.lastMessage.createdTimestamp + a.recipient.lastMessage.createdTimestamp);
        });
        // */
        for (var i = 0; i < listSize; ++i) {
          txt += `\n{white-fg}{bold}-{/bold}{/white-fg} {yellow-fg}${chns[i].recipient.tag}{/yellow-fg}`
        }
      }
      this.infolog.setContent(txt);
    } else {
      this.infolog.setContent('Not logged in :(.');
    }
  }
  init() {
    const me = this;
    this.inputbox.key('enter', () => {
      if (this.awaitingResponse) this.emit('internalInput', this.inputbox.getValue());
      else this.emit('input', this.inputbox.getValue());
        this.history.push(this.inputbox.getValue());
      this.inputbox.clearValue();
      this.inputbox.focus();
      this.screen.render();
        this.historyAt = 1; // Reset history index after message sent
    });
    this.inputbox.key('up', () => {
        const back = me.history[me.history.length - me.historyAt];
        me.historyAt++;
        if (back) {
            me.inputbox.setValue(back);
        }
    });
    this.inputbox.key('down', () => {
        if (me.historyAt < 1) {
            return; // History index too small
        }
        const forward = me.history[me.history.length - me.historyAt];
        if (forward) {
            me.inputbox.setValue(forward);
        }
    });
    this.screen.append(this.chatbox);
    this.screen.append(this.inputbox);
    this.screen.append(this.infobox);
    this.screen.render();
    this.inputbox.focus();
    me.renderInfo.call(me);
    setInterval(() => {
      me.renderInfo.call(me);
    }, 750);
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
        arrow = (m.author.id == ctx.discord.user.id) ? `{green-fg}{bold}<{/bold}{/green-fg}` : `{red-fg}{bold}>{/bold}{/red-fg}`,
        txt = `${arrow} {yellow-fg}{bold}${ts}{/bold}{/yellow-fg} {white-fg}{bold}${m.author.username}{/bold}{/white-fg} ${m.content}`;
      me.put(txt);
    });
  }
  putMessage(message, opt) {
    return this.putMessages([message], opt);
  }
  putTypingStart(channel, user) {
    // athis.put(`{blue-fg}{bold}↷{/bold}{/blue-fg} {white-fg}{bold}${user.username}{/bold}{/white-fg} has {green-fg}started{/green-fg} typing.`);
  }
  putTypingStop(channel, user) {
    // this.put(`{blue-fg}{bold}↶{/bold}{/blue-fg} {white-fg}{bold}${user.username}{/bold}{/white-fg} has {red-fg}stopped{/red-fg} typing.`);
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
