const sharp = require('sharp');
const request = require('snekfetch');
const tng = require('blessed/vendor/tng');
const Storage = require('../Storage');

const WIDTH_TARGET = 32;

async function imageElement({ id, url, width, height }) {
  if (await Storage.hasFile(id)) return makeImage({ path: Storage.getFilePath(id), width, height });
  try {
    const data = await request.get(url)
      .then((r) => {
        const factor = width / WIDTH_TARGET;
        return sharp(r.body)
          .resize(WIDTH_TARGET, Math.round(height / factor))
          .toBuffer();
      });
    await Storage.setFile(id, data);
    return makeImage({ path: Storage.getFilePath(id), width, height });
  } catch (err) {
    return null;
  }
}

function makeImage({ path }) {
  const raw = tng(path, {
    optimization: 'mem',
  });
  return raw.renderANSI(raw.bmp);
}

module.exports = imageElement;
