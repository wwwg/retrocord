module.exports = (vorpal) => {
  vorpal.command('/game <game...>')
    .action((args, cb) => {
      vorpal.discord.user.setGame(args.game.join(' ')).then(() => {
        vorpal.log(vorpal.chalk.bold(`Set playing status to ${args.game.join(' ')}`));
        cb();
      }).catch(() => {
        vorpal.log(vorpal.chalk.bold(`Could not set playing status!`));
        cb();
      });
    });
};
