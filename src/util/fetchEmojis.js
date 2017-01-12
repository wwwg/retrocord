const empty = new (require('discord.js').Collection)();

module.exports = (vorpal) => {
  const discord = vorpal.discord;
  if (discord.user && discord.user.premium) {
    return discord.emojis;
  } else if (vorpal.current.guild) {
    return discord.guilds.get(vorpal.current.guild).emojis;
  } else {
    return empty;
  }
};
