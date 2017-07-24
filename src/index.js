const Storage = require('./Storage');
const gui = require('./gui');
const commands = require('./commands');
const assets = require('./assets');
const discord = require('./discord');

const ctx = { gui, assets, discord, allowInput: false };

gui.on('input', (message) => {
  if (message.startsWith(':')) {
    const [command, ...args] = message.slice(1).split(' ');
    if (command in commands) commands[command].run(ctx, args);
  } else {
    if (!ctx.allowInput) return;
    gui.put(message);
  }
});

gui.init();
gui.put(assets.logo, { center: true });

if (Storage.has('token')) {
  discord.run(ctx);
} else {
  gui.put('{red+bold}Please Login!{/}', { center: true });
}
