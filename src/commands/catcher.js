const emoji = require('node-emoji');
const fetchEmojis = require('../util/fetchEmojis');

module.exports = (vorpal) => {
  const { discord, chalk } = vorpal;
  vorpal.catch('[words...]', 'send a message')
    .autocomplete(() => {
      const emojis = fetchEmojis(vorpal);
      return [
        ...emojis.map(x => `:${x.name}:`),
        ...Object.keys(emoji.emoji).map(x => `:${x}:`),
      ];
    })
    .action((args, cb) => {
      const emojis = fetchEmojis(vorpal);

      if (vorpal.current.channel) {
        args.words = args.words.map(w => w.toString());
        for (let word in args.words) {
          if (args.words[word].startsWith('@')) {
            const [username, discrim] = args.words[word].split('#').map(x => x.replace('@', '').toLowerCase());
            let user = discord.users.find(u => {
              let match = false;
              if (u.username.replace(' ', '').toLowerCase() === username) match = true;
              if (discrim && u.discriminator !== discrim) match = false;
              return match;
            });
            if (user) args.words[word] = user.toString();
          }
        }

        let words = args.words.join(' ');
        for (const match of words.match(/:[^:]+:/g) || []) {
          let found = emojis.find(x => x.name.toLowerCase() === match.replace(/:/g, '').toLowerCase());
          words = words.replace(match, found ? found.toString() : null || emoji.get(match));
        }

        discord.channels.get(vorpal.current.channel).sendMessage(words);
      } else {
        vorpal.log(chalk.bold('Error: you must join a channel before you can send messages!'));
      }
      cb();
    });
};
