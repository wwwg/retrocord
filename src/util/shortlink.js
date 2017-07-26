const { encode } = require('tinyint');

function shortlink(name, ...ids) {
  return `https://retro.lol/${ids.map(encode).join('/')}/${name}`;
}

module.exports = shortlink;
