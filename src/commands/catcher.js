const emoji = require('node-emoji');

module.exports = (vorpal) => {
  const { discord, chalk } = vorpal;
  vorpal.catch('[words...]', 'send a message')
    .autocomplete(() => [
      ...vorpal.current.guild ? discord.guilds.get(vorpal.current.guild).emojis.map(x => `:${x.name}:`) : [],
      ...Object.keys(emoji.emoji).map(x => `:${x}:`),
    ])
    .action((args, cb) => {
      if (vorpal.current.channel) {
        args.words = args.words.map(w => w.toString());
        for (let word in args.words) {
          if (args.words[word].startsWith('@')) {
            let user = discord.users.find(x => x.username.toLowerCase() === args.words[word].replace('@', '').toLowerCase());
            if (user) args.words[word] = user.toString();
          }
        }

        let words = args.words.join(' ');
        for (const match of words.match(/:[^:]+:/g) || []) {
          let found;
          if (vorpal.current.guild) {
            found = discord.guilds.get(vorpal.current.guild).emojis.find(x => x.name.toLowerCase() === match.replace(/:/g, '').toLowerCase());
          }
          words = words.replace(match, found ? found.toString() : null || emoji.get(match));
        }

        discord.channels.get(vorpal.current.channel).sendMessage(words);
      } else {
        vorpal.log(chalk.bold('Error: you must join a channel before you can send messages!'));
      }
      cb();
    });
};
