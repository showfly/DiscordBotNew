const { SlashCommandBuilder } = require('discord.js');
const gameRoles = require('../data/gameRoles');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('rofox_role')
    .setDescription('顯示表情反應角色選擇訊息'),

  async execute(interaction) {
    let items = '';
    for (const [emoji, roleName] of Object.entries(gameRoles)) {
      items += `${emoji} ${roleName}\n`;
    }
    
    const sent = await interaction.channel.send(
      '🎮 點選以下表情來取得遊戲身分組：\n' + items
    );
    
    for (const emoji of Object.keys(gameRoles)) {
      await sent.react(emoji);
    }

    await interaction.reply({ content: '✅ 角色訊息已送出！', ephemeral: true });
  },
};
