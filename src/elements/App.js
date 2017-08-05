const blessed = require('blessed');

const Asset = require('./Asset');
const Text = require('./Text');
const Input = require('./Input');
const Channel = require('./Channel');

const Storage = require('../Storage');

function App() {
  const state = { startup: false };

  const logo = new Asset({ asset: 'logo', style: { center: true, vcenter: true } });

  if (!Storage.has('token')) {
    return wrapper([
      logo,
      new Text({ content: '{bold}Please Login{/bold}' }),
    ]);
  } else if (state.startup) {
    return wrapper([
      logo,
      new Text({ content: '{bold}Logging in...{/bold}' }),
    ]);
  } else {
    return wrapper([new Channel()]);
  }
}

function wrapper(inside) {
  return blessed.element({
    children: [
      blessed.box({
        label: 'retrocord',
        width: '100%',
        height: '100%-1',
        border: { type: 'line' },
        children: inside,
      }),
      new Input(),
    ],
  });
}

module.exports = App;
