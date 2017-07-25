const Storage = require('./Storage');
const messageElement = require('./elements/message');

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
      ctx.gui.put('{bold}Logged Out!{/bold}');
    },
  },
  join: {
    run: (ctx, args) => {
      const SPLIT_RE = /@|#/;
      let [scope, channel] = args.join(' ').split(SPLIT_RE).map((x) => x.trim());
      if (scope === 'dm') {
        channel = ctx.discord.channels
          .filter((c) => c.type === 'dm')
          .find((c) => c.recipient.username.toLowerCase() === channel.toLowerCase());
      } else {
        scope = scope ?
          ctx.discord.guilds.find((g) => g.name.toLowerCase() === scope.toLowerCase()) :
          ctx.current.scope;
        if (!scope) return ctx.gui.put('{bold}Invalid Guild{/bold}');
        channel = scope.channels
          .filter((c) => c.type === 'text')
          .find((c) => c.name.toLowerCase() === channel.toLowerCase());
      }
      if (!channel) return ctx.gui.put('{bold}Invalid Channel{/bold}');
      if (channel.recipient) {
        ctx.gui.put(`{bold}Joining DM with ${channel.recipient.tag}{/bold}`);
      } else {
        ctx.gui.put(`{bold}Joining #${channel.name} in ${scope.name}{/bold}`);
      }
      channel.fetchMessages({ limit: 5 }).then((messages) => {
        for (const message of messages.array().reverse()) ctx.gui.put(messageElement(message), { format: false });
      });
      ctx.current.channel = channel;
      ctx.current.scope = scope;
    },
  },
  nick: {
    aliases: ['nickname'],
    run: (ctx, args) => {
      if (!ctx.current.scope || ctx.current.scope === 'dm') {
        return ctx.gui.put('{bold}You must be in a guild to set your nickname{/bold}');
      }
      ctx.current.scope.member(ctx.discord.user).setNickname(args.join(' '))
        .then(() => ctx.gui.put(`{bold}Nickname set to "${args.join(' ')}"{/bold}`))
        .catch((err) => ctx.gui.put(`{bold}Unable to set nickname: ${err.message}{/bold}`));
    },
  },
  search: {
    run: (ctx, args) => {
      ctx.current.channel.search({ content: args.join(' ') })
        .then((r) => r.results.map((msgs) => msgs.find((m) => m.hit)))
        .then((messages) => {
          ctx.gui.put('{bold}-- BEGIN SEARCH --{/bold}');
          const results = messages
            .map((r) => messageElement(r, true))
            .slice(0, 10)
            .reverse()
            .join('\n');
          ctx.gui.put(results, { format: false });
          ctx.gui.put('{bold}--- END SEARCH ---{/bold}');
        });
    },
  },
};

for (const [k, v] of Object.entries(module.exports)) {
  if (!v.aliases) continue;
  for (const alias of v.aliases) {
    module.exports[alias] = module.exports[k];
  }
}
