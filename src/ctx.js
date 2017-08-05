const EventEmitter = require('events');

class CTX extends EventEmitter {
  constructor() {
    super();
    this.current = {
      scope: null,
      channel: null,
    };
    this.startup = true;
  }
}

module.exports = new CTX();
