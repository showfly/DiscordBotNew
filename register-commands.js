// register-commands.js
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');
const features = require('./config/features');

const commands = [
  new SlashCommandBuilder()
    .setName('rofox_color')
    .setDescription('選擇顏色身分組')
    .toJSON(),
];

if (features.gameRoles) {
  commands.push(
    new SlashCommandBuilder()
      .setName('rofox_role')
      .setDescription('選擇遊戲身分組')
      .setDefaultMemberPermissions()
      .toJSON(),
  );
}

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔃 開始註冊 Slash 指令...');

    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('✅ Slash 指令註冊成功！');
  } catch (error) {
    console.error('❌ 註冊失敗：', error);
  }
})();
