const Storage = require('./Storage');

module.exports = {
  q: {
    aliases: ['quit', 'exit'],
    run: () => process.exit(0),
  },
  login: {
    run: (ctx, [token]) => {
      Storage.set('token', token);
      ctx.discord.run(ctx);
    },
  },
  logout: {
    run: (ctx) => {
      Storage.delete('token');
      ctx.discord.ws.destroy();
      ctx.gui.put('{red+bold}Logged Out!{/}');
    }
  },
};

for (const [k, v] of Object.entries(module.exports)) {
  if (!v.aliases) continue;
  for (const alias of v.aliases) {
    module.exports[alias] = module.exports[k];
  }
}
