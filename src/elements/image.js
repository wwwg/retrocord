const request = require('snekfetch');
const tng = require('blessed/vendor/tng');
const Storage = require('../Storage');

const WIDTH_TARGET = 32;

let resize;
try {
  const sharp = require('sharp');
  resize = (data, width, height) => {
    const factor = width / WIDTH_TARGET;
    return sharp(data)
      .resize(WIDTH_TARGET, Math.round(height / factor))
      .toBuffer();
  };
} catch (e) {
  const jimp = require('jimp');
  resize = (data, width, height) =>
    new Promise((resolve, reject) => {
      const factor = width / WIDTH_TARGET;
      jimp.read(data, (error, image) => {
        if (error) return reject(error);
        image.resize(WIDTH_TARGET, Math.round(height / factor))
          .getBuffer(jimp.AUTO, (err, buffer) => {
            if (err) reject(err);
            else resolve(buffer);
          });
      });
    });
}

async function imageElement({ id, url, width, height }) {
  if (await Storage.hasFile(id)) return makeImage({ path: Storage.getFilePath(id), width, height });
  try {
    const data = await request.get(url)
      .then((r) => resize(r.body, width, height));
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
