const snekparse = require('snekparse');
process.snekv = snekparse(process.argv);

const App = require('./elements/App.js');

const blessed = require('blessed');
require('./discord');

const screen = blessed.screen({
  title: 'retrocord',
  // autoPadding: true,
  smartCSR: true,
  dockBorders: true,
  fullUnicode: true,
});

const app = new App();

screen.append(app);
screen.render();
