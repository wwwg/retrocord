const Storage = require('./Storage');
const lookup = require('./util/lookup');

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
    run: async(ctx, args) => {
      const SPLIT_RE = /@|#/;
      let [scope, channel] = args.join(' ').split(SPLIT_RE).map((x) => x.trim());
      if (channel) channel = channel.toLowerCase();
      if (scope === 'dm') {
        const query = channel;
        channel = ctx.discord.channels
          .filter((c) => c.type === 'group')
          .find((c) => c.name && c.name.toLowerCase() === query);
        if (!channel) {
          channel = lookup.user(query);
          if (channel) {
            channel = await channel.createDM().catch((err) => {
              ctx.gui.put(`{bold}${err.message}{/bold}`);
              return null;
            });
          }
        }
      } else {
        scope = scope ? lookup.guild(scope) : ctx.current.scope;
        if (!scope) return ctx.gui.put('{bold}Invalid Guild{/bold}');
        channel = channel ?
          scope.channels
            .filter((c) => c.type === 'text')
            .find((c) => c.name.toLowerCase() === channel.toLowerCase()) :
          scope.defaultChannel;
      }
      if (!channel) return ctx.gui.put('{bold}Invalid Channel{/bold}');
      if (channel.recipient || channel.recipients) {
        if (channel.recipients) {
          ctx.gui.put(`{bold}Joining the group conversation in "${channel.name}"{/bold}`);
        } else {
          ctx.gui.put(`{bold}Joining DM with ${channel.recipient.tag}{/bold}`);
        }
      } else {
        if (channel.nsfw && !(Storage.get('nsfw_store') || []).includes(scope.id)) {
          // eslint-disable-next-line max-len
          const answer = await ctx.gui.awaitResponse('{bold}You must be at least eighteen years old to view this channel. Are you over eighteen and willing to see adult content?{/bold} (respond with yes/no)');
          if (!['yes', 'y'].includes(answer.toLowerCase())) return;
          Storage.set('nsfw_store', (Storage.get('nsfw_store') || []).concat(scope.id));
        }
        ctx.gui.put(`{bold}Joining #${channel.name} in ${scope.name}{/bold}`);
      }
      channel.fetchMessages({ limit: 5 }).then((messages) => {
        ctx.gui.putMessages(messages.array().reverse(), { mdy: true });
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
      ctx.current.channel.search({
        content: args.join(' '),
        has: args.has,
        authorType: args['author-type'],
        limit: +args.limit || 10,
      })
        .then((r) => r.results.map((msgs) => msgs.find((m) => m.hit)))
        .then(async(messages) => {
          ctx.gui.put('{bold}-- BEGIN SEARCH --{/bold}');
          ctx.gui.put(`{bold} Query: ${args.join(' ')}{/bold}`);
          await ctx.gui.putMessages(messages.reverse(), { mdy: true });
          ctx.gui.put('{bold}--- END SEARCH ---{/bold}');
        })
        .catch((err) => {
          ctx.gui.put(`{bold}Search Error (${err.message}){/bold}`);
        });
    },
  },
  set: {
    run: (ctx, [name, value]) => {
      if (ctx.rc.set(name, value)) ctx.gui.put(`{bold}Changed setting "${name}" to "${value}"{/bold}`);
      else ctx.gui.put(`{bold}Failed to change setting "${name}" to "${value}"{/bold}`);
    },
  },
  shrug: {
    run: (ctx, args) => {
      if (!ctx.current.channel) return;
      ctx.current.channel.send(`${args.join(' ')} ¯\\_(ツ)_/¯`.trim());
    },
  },
  tableflip: {
    run: (ctx, args) => {
      if (!ctx.current.channel) return;
      ctx.current.channel.send(`${args.join(' ')} (╯°□°）╯︵ ┻━┻`.trim());
    },
  },
  guilds: {
    run: (ctx) => {
      ctx.gui.put('{bold}Available Guilds:{/bold}');
      ctx.gui.put(ctx.discord.guilds.map((g) => g.name).join(', '));
    },
  },
  channels: {
    run: (ctx) => {
      if (!ctx.current.scope || ctx.current.scope === 'dm') return;
      ctx.gui.put('{bold}Available Channels:{/bold}');
      ctx.gui.put(ctx.current.scope.channels.filter((c) => c.type === 'text').map((g) => g.name).join(', '));
    },
  },
};

for (const [k, v] of Object.entries(module.exports)) {
  if (!v.aliases) continue;
  for (const alias of v.aliases) {
    module.exports[alias] = module.exports[k];
  }
}
