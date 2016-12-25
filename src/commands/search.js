const Discord = require('discord.js');
const superagent = require('superagent');

module.exports = (vorpal) => {
  const { chalk, discord, timestamp } = vorpal;
  vorpal.command('/search <query...>', 'find messages in the channel')
    .option('--guild')
    .option('--show <number>')
    .action((args, cb) => {
      if (vorpal.current.channel) {
        const start = Date.now();
        const url = `https://discordapp.com/api/guilds/${vorpal.current.guild}/messages/search?content=${args.query.join(' ')}${args.options.guild ? '' : `&channel_id=${vorpal.current.channel}`}`;
        superagent.get(url).set('Authorization', discord.token).end((err, res) => {
          if (res.body.total_results === 0 || err || res.body.code) {
            vorpal.log(chalk.bold('Error:', res.body.code ? 'Still indexing...' : null || 'No results found!'));
            return cb();
          } else {
            let results = res.body.messages.map(x => {
              const m = x.find(z => z.hit);
              return new Discord.Message(discord.channels.get(m.channel_id), m, discord);
            });
            const occurances = {};
            for (const m of results) {
              if (!occurances[m.author.id]) occurances[m.author.id] = 0;
              occurances[m.author.id]++;
            }
            let highestUser = discord.users.get(Object.keys(occurances)[Object.values(occurances).indexOf(Object.values(occurances).sort().reverse()[0])]);
            highestUser = `${highestUser.username}#${highestUser.discriminator}`;
            results = results.map(r => chalk.bold(`${chalk.yellow(timestamp(new Date(r.createdAt), true))} ${r.author.username}#${r.author.discriminator} `) + r.cleanContent)
              .slice(0, args.options.show || 10).reverse();
            const end = Date.now();
            vorpal.log(chalk.bold(`Found ${res.body.total_results} results in ${end - start}ms (showing ${results.length})`));
            vorpal.log(`Highest User: ${highestUser}`);
            vorpal.log(chalk.bold('-- BEGIN SEARCH --'));
            vorpal.log(results.join('\n'));
            vorpal.log(chalk.bold('--- END SEARCH ---'));
            return cb();
          }
        });
      } else {
        vorpal.log(chalk.bold('Error: you must join a channel before you can search!'));
        return cb();
      }
      return true;
    });
};
