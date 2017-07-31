const discord = require('./discord');
const fs = require('fs');
const path = require('path');
const util = require('util');

const SCOPE = discord.client.options.http.api;

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);
const existsAsync = util.promisify(fs.exists);
const unlinkAsync = util.promisify(fs.unlink);

const OS_STORAGE_PATH = getOSStoragePath();
if (!fs.existsSync(OS_STORAGE_PATH)) {
  fs.mkdirSync(OS_STORAGE_PATH);
  fs.mkdirSync(path.join(OS_STORAGE_PATH, 'files'));
  fs.mkdirSync(path.join(OS_STORAGE_PATH, '.retrorc'));
}
const STORAGE_PATH = path.join(OS_STORAGE_PATH, 'storage.json');

const cache = {
  storage: {},
  rc: {
    set(key, value) {
      this[key] = value;
      const src = Object.entries(this)
        .filter(([k]) => k !== 'set')
        .map((e) => e.join('='))
        .join('\n');
      try {
        fs.writeFileSync(path.join(OS_STORAGE_PATH, '.retrorc'), src);
        return true;
      } catch (err) {
        return false;
      }
    },
  },
};

try {
  cache.storage = JSON.parse(fs.readFileSync(STORAGE_PATH));
} catch (err) {} // eslint-disable-line no-empty

try {
  const src = fs.readFileSync(path.join(OS_STORAGE_PATH, '.retrorc')).toString();
  cache.rc = src
    .trim().split('\n')
    .map((p) => p.split('='))
    .reduce((o, [k, v]) => {
      o[k] = v;
      return o;
    }, cache.rc);
} catch (err) {} // eslint-disable-line no-empty

module.exports = {
  rc: cache.rc,
  get(key) {
    return cache.storage[SCOPE][key];
  },
  set(key, value) {
    const ret = cache.storage[SCOPE][key] = value;
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(cache.storage));
    return ret;
  },
  has(key) {
    return Reflect.has(cache.storage[SCOPE], key);
  },
  delete(key) {
    const ret = delete cache.storage[SCOPE][key];
    fs.writeFileSync(STORAGE_PATH, JSON.stringify(cache.storage));
    return ret;
  },
  getFilePath(key) {
    return path.join(OS_STORAGE_PATH, 'files', key);
  },
  getFile(key) {
    return readFileAsync(path.join(OS_STORAGE_PATH, 'files', key))
      .catch(() => null);
  },
  setFile(key, value) {
    return writeFileAsync(path.join(OS_STORAGE_PATH, 'files', key), value)
      .then(() => true).catch(() => false);
  },
  hasFile(key) {
    return existsAsync(path.join(OS_STORAGE_PATH, 'files', key)).catch(() => false);
  },
  deleteFile(key) {
    return unlinkAsync(path.join(OS_STORAGE_PATH, 'files', key))
      .then(() => true).catch(() => false);
  },
};

if (!cache.storage[SCOPE]) cache.storage[SCOPE] = {};

function getOSStoragePath() {
  switch (process.platform) {
    case 'win32':
      return `${process.env.APPDATA}\\retrocord`;
    case 'darwin':
    case 'linux':
      return `${process.env.HOME}/.config/retrocord`;
    default:
      return '.';
  }
}
