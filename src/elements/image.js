const request = require('snekfetch');
const sharp = require('sharp');
const tng = require('blessed/vendor/tng');
const Storage = require('../Storage');

async function imageElement({ id, url, width, height }) {
  if (await Storage.hasFile(id)) return makeImage({ path: Storage.getFilePath(id), width, height });
  const data = await request.get(url)
    .then((r) => sharp(r.body))
    .then((s) => {
      const target = 32;
      const factor = width / target;
      return s.resize(target, Math.round(height / factor)).toBuffer();
    });
  await Storage.setFile(id, data);
  return makeImage({ path: Storage.getFilePath(id), width, height });
}

function makeImage({ path }) {
  const raw = tng(path, {
    optimization: 'mem',
  });
  return raw.renderANSI(raw.bmp);
}

module.exports = imageElement;
