const gameRoles = require('../data/gameRoles');

module.exports = async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const member = await reaction.message.guild.members.fetch(user.id);
  const roleName = gameRoles[reaction.emoji.name];
  if (!roleName) return;

  const role = reaction.message.guild.roles.cache.find(r => r.name === roleName);
  if (role) await member.roles.remove(role);
};
