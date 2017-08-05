const snekparse = require('snekparse');
process.snekv = snekparse(process.argv);

const App = require('./elements/App.js');

const blessed = require('blessed');
require('./discord');

const screen = blessed.screen({
  title: 'retrocord',
  autoPadding: true,
  smartCSR: true,
  dockBorders: true,
  fullUnicode: true,
});

screen.append(new App());

screen.render();
