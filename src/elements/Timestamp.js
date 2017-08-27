const blessed = require('blessed');
const timestamp = require('../util/timestamp');

function Timestamp(createdAt) {
  const date = new Date();
  return blessed.box({
    tags: true,
    style,
    content: timestamp(createdAt, date),
  });
}

module.exports = Timestamp;
