const discord = require('../discord'),
  distance = require('jaro-winkler'),
  emojiRegex = require('emoji-regex');

function clean(str, { emoji = true, spaces = false } = {}) {
  let copy = String(str);
  if (emoji) copy = copy.replace(emojiRegex(), '');
  if (spaces) copy = copy.replace(/ /g, '');
  return copy
    .replace(/—|–/g, '-')
    .trim()
    .toLowerCase();
}

function lookupUser(query, users) {
  if (!users) {
    users = global.ctx.discord.users.array();
  }
  if (!query) return null;
  const [username, discrim] = clean(query, { spaces: true }).split('#');
  for (const user of users) {
    const scan = clean(user.username, { spaces: true });
    if (scan !== username && Math.round(distance(scan, username) * 10) <= 9) continue;
    if (discrim && discrim !== user.discriminator) continue;
    return user;
  }
}

function lookupGuild(query, guilds) {
  if (!guilds) {
    guilds = global.ctx.discord.guilds.array();
  }
  if (!query) return null;
  query = clean(query);
  for (const guild of guilds) {
    const scan = clean(guild.name);
    if (scan !== query && Math.round(distance(scan, query) * 10) <= 9) continue;
    return guild;
  }
}

module.exports = {
  user: lookupUser,
  guild: lookupGuild,
  clean,
};
