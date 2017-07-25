const fs = require('fs');
const path = require('path');

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
  getFile(key) {
    try {
      return fs.readFileSync(path.join(OS_STORAGE_PATH, key));
    } catch (err) {
      return null;
    }
  },
  getFilePath(key) {
    return path.join(OS_STORAGE_PATH, key);
  },
  setFile(key, value) {
    try {
      fs.writeFileSync(path.join(OS_STORAGE_PATH, key), value);
      return true;
    } catch (err) {
      return false;
    }
  },
  hasFile(key) {
    return fs.existsSync(path.join(OS_STORAGE_PATH, key));
  },
  deleteFile(key) {
    try {
      fs.unlinkSync(path.join(OS_STORAGE_PATH, key));
      return true;
    } catch (err) {
      return false;
    }
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
