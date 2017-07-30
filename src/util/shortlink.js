const { encode } = require('tinyint');

function shortlink(name, ...ids) {
  return `https://retro.lol/${ids.filter((i) => i).map(encode).join('/')}/${name}`;
}

module.exports = shortlink;
