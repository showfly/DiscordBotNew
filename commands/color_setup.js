const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const syncColorRoles = require('../utils/syncColorRoles');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('color_setup')
    .setDescription('同步名字顏色身分組')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const result = await syncColorRoles(interaction.guild);
    const details = [
      `已存在：${result.existing}`,
      `新建立：${result.created}`,
      `失敗：${result.failed}`,
    ].join('\n');

    await interaction.editReply({
      content: `🎨 顏色身分組同步完成\n\n${details}`,
    });
  },
};
