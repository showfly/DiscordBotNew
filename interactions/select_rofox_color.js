const colorRoleMap = require('../data/colorRoles');

module.exports = async function (interaction) {
  const selected = interaction.values[0];
  const { name: roleName, label, emoji } = colorRoleMap[selected];
  const member = interaction.member;
  const allColorRoles = interaction.guild.roles.cache.filter(r => r.name.startsWith('color_'));

  await member.roles.remove(allColorRoles).catch(console.error);

  const newRole = allColorRoles.find(r => r.name === roleName);
  if (newRole) {
    await member.roles.add(newRole);
    await interaction.reply({
      content: `✅ 你現在是 ${emoji} **${label}**！`,
      ephemeral: true,
    });
  } else {
    await interaction.reply({
      content: `⚠️ 找不到角色：${roleName}，請通知管理員協助建立。`,
      ephemeral: true,
    });
  }
};
