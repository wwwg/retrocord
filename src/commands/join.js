module.exports = (vorpal) => {
  const { chalk, discord, logMessage } = vorpal;
  vorpal.command('/join <guild#channel...>', 'join a channel')
    .autocomplete((text) => {
      const x = discord.guilds.map(g => g.name.toLowerCase());
      if (text.startsWith('dm')) {
        x.push(...discord.channels.filter(c => c.type === 'dm' || c.type === 'group').map(c => `@${(c.name ? c.name : c.recipient.username).toLowerCase()}`));
      } else {
        x.push(...discord.channels.filter(c => c.type === 'text').map(c => `#${c.name.toLowerCase()}`));
      }
      return x;
    })
    .action((args, cb) => {
      args = args['guild#channel'].join(' ');
      const re = /@|#/;
      let [guild, channel] = [args.split(re)[0].trim(), args.split(re)[1].trim()];
      if (guild !== 'dm') {
        guild = guild ? discord.guilds.find(g => g.name.toLowerCase() === guild.toLowerCase()) :
          discord.guilds.get(vorpal.current.guild);
        if (!guild) {
          vorpal.log(chalk.bold('Error: not a valid guild'));
          return cb();
        }
        channel = channel ? guild.channels.filter(c => c.type !== 'voice').find(c => c.name.toLowerCase() === channel.toLowerCase().trim()) : guild.defaultCHannel;
        if (!channel) {
          vorpal.log(chalk.bold('Error: not a valid channel'));
          return cb();
        }
        vorpal.log(chalk.bold(`Joining ${channel.name} in ${guild.name}`));
        vorpal.current = { channel: channel.id, guild: guild.id };
      } else {
        channel = discord.channels.filter(c => c.type === 'dm').find(c => c.recipient.username.toLowerCase() === channel.toLowerCase().trim());
        if (!channel) {
          vorpal.log(chalk.bold('Error: not a valid channel'));
          return cb();
        }
        vorpal.log(chalk.bold(`Joining DM with ${channel.recipient.username}`));
        vorpal.current = { channel: channel.id };
      }
      channel.fetchMessages({ limit: 5 }).then(messages => {
        for (const message of messages.array().reverse()) logMessage(message);
      }).catch(err => {
        vorpal.log(`Error fetching channel logs: ${err.message}`);
      });
      return cb();
    });
};
