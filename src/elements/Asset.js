const blessed = require('blessed');

const assets = require('../lib/assets');

function Asset({ asset, style }) {
  return blessed.box({
    tags: true,
    style,
    top: style.vcenter ? 'center' : undefined,
    content: assets[asset],
  });
}

module.exports = Asset;
