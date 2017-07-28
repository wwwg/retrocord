const discord = require('../discord');
const distance = require('jaro-winkler');

function lookup(query, users = discord.client.users.array()) {
  if (!query) return null;
  const [username, discrim] = query.toLowerCase().split('#');
  for (const user of users) {
    const scan = user.username.replace(/ /g, '').toLowerCase();
    if (scan !== username && distance(scan, username) < 0.9) continue;
    if (discrim && discrim !== user.discriminator) continue;
    return user;
  }
}

module.exports = lookup;
