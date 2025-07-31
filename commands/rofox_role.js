const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rofox_role')
    .setDescription('顯示表情反應角色選擇訊息'),

  async execute(interaction) {
    const sent = await interaction.channel.send(
      '🎮 點選以下表情來取得遊戲身分組：\n🐉 龍族幻想\n🎵 鳴潮'
    );
    await sent.react('🐉');
    await sent.react('🎵');

    await interaction.reply({ content: '✅ 角色訊息已送出！', ephemeral: true });
  },
};