#!/usr/bin/env node

require('./util/jsx');
const snekparse = require('snekparse');
process.snekv = snekparse(process.argv);

require('./index.jsx');
require('./discord');
