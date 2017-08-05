const blessed = require('blessed');

function Text({ content }) {
  return blessed.box({
    tags: true,
    content,
  });
}

module.exports = Text;
