const request = require('snekfetch');
const blessed = require('blessed');
const Storage = require('../Storage');

async function imageElement({ id, url, width, height }) {
  if (await Storage.hasFile(id)) return makeImage({ path: Storage.getFilePath(id), width, height });
  const data = await request.get(url).then((r) => r.body);
  await Storage.setFile(id, data);
  return makeImage({ path: Storage.getFilePath(id), width, height });
}

function makeImage({ path, width, height }) {
  return blessed.image({
    top: 0,
    left: 0,
    width,
    height,
    type: process.platform === 'linux' ? 'overlay' : 'ansi',
    file: path,
    search: true,
  });
}

module.exports = imageElement;
