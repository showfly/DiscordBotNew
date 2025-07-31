const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder } = require('discord.js');
const colorRoleMap = require('../data/colorRoles');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rofox_color')
    .setDescription('選擇你的名字顏色'),

  async execute(interaction) {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('select_rofox_color')
      .setPlaceholder('請選擇顏色')
      .addOptions(
        Object.entries(colorRoleMap).map(([key, { label, emoji }]) => ({
          label,
          value: key,
          emoji
        }))
      );

    await interaction.reply({
      content: '🌈 選擇你想要的顏色：',
      components: [new ActionRowBuilder().addComponents(menu)],
      ephemeral: true,
    });
  },
};
