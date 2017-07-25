const request = require('snekfetch');
const blessed = require('blessed');
const Storage = require('../Storage');

module.exports = (emoji) => {
  const uniq = emoji.identifier;
  if (Storage.hasFile(uniq)) {
    return Promise.resolve(makeImage(Storage.getFilePath(uniq)));
  } else {
    return request.get(emoji.url).then((r) => {
      Storage.setFile(uniq, r.body);
      return makeImage(Storage.getFilePath(uniq));
    });
  }
};

function makeImage(path) {
  return blessed.image({
    top: 0,
    left: 0,
    width: 'shrink',
    height: 'shrink',
    type: process.platform === 'linux' ? 'overlay' : 'ansi',
    file: path,
    search: true,
  });
}
