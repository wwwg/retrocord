const fs = require('fs');
const path = require('path');

const ASSET_DIR = path.join(__dirname, '../..', 'assets');

const files = fs.readdirSync(ASSET_DIR);
for (const file of files) {
  module.exports[file.split('.')[0]] = fs.readFileSync(path.join(ASSET_DIR, file)).toString();
}
