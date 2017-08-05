const blessed = require('blessed');
const timestamp = require('../util/timestamp');

function Timestamp({ timestamp: t, mdy, style }) {
  const date = typeof mdy !== 'undefined' ? mdy : new Date() - t > 86400000;
  return blessed.box({
    tags: true,
    style,
    content: timestamp(t, date),
  });
}

module.exports = Timestamp;
