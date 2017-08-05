const blessed = require('blessed');
const ctx = require('../ctx');

function Input() {
  return blessed.textbox({
    bottom: 0,
    width: '100%',
    height: 1,
    inputOnFocus: true,
    mouse: false,
    onSubmit(content) {
      if (!content) return;
      ctx.emit('input', content);
    },
  });
}

module.exports = Input;
