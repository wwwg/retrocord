const fs = require('fs');
const path = require('path');
const util = require('util');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const existsAsync = util.promisify(fs.exists);
const unlinkAsync = util.promisify(fs.unlink);

const OS_STORAGE_PATH = getOSStoragePath();
if (!fs.existsSync(OS_STORAGE_PATH)) fs.mkdirSync(OS_STORAGE_PATH);
const STORAGE_PATH = path.join(OS_STORAGE_PATH, 'storage.json');
// if (!fs.existsSync(STORAGE_PATH)) fs.mkdirSync(STORAGE_PATH);

let cache = {};
try {
  cache = JSON.parse(fs.readFileSync(STORAGE_PATH));
} catch (err) {} // eslint-disable-line no-empty

module.exports = {
  get(key) {
    return cache[key];
  },
  set(key, value) {
    const ret = cache[key] = value;
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(cache));
    return ret;
  },
  has(key) {
    return Reflect.has(cache, key);
  },
  delete(key) {
    const ret = delete cache[key];
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(cache));
    return ret;
  },
  getFilePath(key) {
    return path.join(OS_STORAGE_PATH, key);
  },
  getFile(key) {
    return readFileAsync(path.join(OS_STORAGE_PATH, key))
      .catch(() => null);
  },
  setFile(key, value) {
    return writeFileAsync(path.join(OS_STORAGE_PATH, key), value)
      .then(() => true).catch(() => false);
  },
  hasFile(key) {
    return existsAsync(path.join(OS_STORAGE_PATH, key)).catch(() => false);
  },
  deleteFile(key) {
    return unlinkAsync(path.join(OS_STORAGE_PATH, key))
      .then(() => true).catch(() => false);
  },
};

function getOSStoragePath() {
  switch (process.platform) {
    case 'darwin':
      return `${process.env.HOME}/Library/Application Support/retrocord`;
    case 'win32':
      return `${process.env.APPDATA}\\retrocord`;
    case 'linux':
      return `${process.env.HOME}/.retrocord`;
    default:
      return '.';
  }
}
