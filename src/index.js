const gui = require('./gui');

gui.on('input', (message) => {
  if (message.startsWith(':')) {
    // handle command
  } else {
    // send
  }
});

gui.init();
gui.put('retrocord, a thing');
