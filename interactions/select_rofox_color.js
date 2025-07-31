const { EmbedBuilder } = require('discord.js');
const colorRoleMap = require('../data/colorRoles');

module.exports = async (interaction) => {
  const selected = interaction.values[0];

  // 從 colorRoles 取得所需資訊
  const { name: roleName, label, emoji, hex } = colorRoleMap[selected];
  const member = interaction.member;

  // 取得所有 color_ 開頭的角色
  const allColorRoles = interaction.guild.roles.cache.filter((r) =>
    r.name.startsWith('color_')
  );

  // 先移除使用者身上的顏色角色
  await member.roles.remove(allColorRoles).catch(console.error);

  // 尋找新角色，並加上
  const newRole = allColorRoles.find((r) => r.name === roleName);
  if (newRole) {
    await member.roles.add(newRole);
  }

  // 建立顏色預覽 Embed
  const embed = new EmbedBuilder()
    .setTitle(`✅ 你現在是 ${emoji} ${label}`)
    .setDescription('這就是你暱稱的新顏色')
    .setColor(hex || '#888888');

  await interaction.reply({
    embeds: [embed],
    ephemeral: true,
  });
};
