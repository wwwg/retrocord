const React = require('react');
const { render } = require('react-blessed');
const blessed = require('blessed');

const AppComponent = require('./Components/App.jsx');

require('./discord');

const screen = blessed.screen({
  title: 'retrocord',
  autoPadding: true,
  smartCSR: true,
  dockBorders: true,
  fullUnicode: true,
});

render(<AppComponent />, screen);
