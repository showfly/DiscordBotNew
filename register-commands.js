// register-commands.js
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('rofox_role') // 或 rofox_menu
    .setDescription('rofox 身分選單') // 顯示名稱可以用中文
    .toJSON(),
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔃 註冊指令中...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log('✅ Slash 指令已成功註冊！');
  } catch (error) {
    console.error(error);
  }
})();