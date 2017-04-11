module.exports = (vorpal) => {
  const { chalk, discord, timestamp } = vorpal;
  vorpal.command('/search <query...>', 'find messages in the channel')
    .option('--guild')
    .option('--show <number>')
    .action((args, cb) => {
      if (vorpal.current.channel) {
        discord.channels.get(vorpal.current.channel).search({
          content: args.query.join(' '),
        })
        .then(r => r.messages)
        .then(r => r.map(msgs => msgs.find(m => m.hit)))
        .then(messages => {
          vorpal.log(chalk.bold('-- BEGIN SEARCH --'));
          const results = messages
            .map(r => chalk.bold(`${chalk.yellow(timestamp(new Date(r.createdAt), true))} ${r.author.tag} `) + r.cleanContent)
            .slice(0, args.options.show || 10)
            .reverse()
            .join('\n');
          console.log(results);
          vorpal.log(chalk.bold('--- END SEARCH ---'));
          return cb();
        });
      } else {
        vorpal.log(chalk.bold('Error: you must join a channel before you can search!'));
        return cb();
      }
      return true;
    });
};
