// register-commands.js
require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

// ✅ 這裡新增你要的指令
const commands = [
  new SlashCommandBuilder()
    .setName('rofox_color')
    .setDescription('選擇顏色身分組') // 顯示名稱
    // .setDefaultMemberPermissions()  // ❌ 不加代表所有人都能用
    .toJSON(),

  new SlashCommandBuilder()
    .setName('rofox_role')
    .setDescription('選擇遊戲身分組') // 另一個指令（你有的）
    .setDefaultMemberPermissions()  // ❌ 不加代表所有人都能用
    .toJSON(),

  // 👉 若你還有其他指令，可依樣新增更多 .setName(...)
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    console.log('🔃 開始註冊 Slash 指令...');

    // ✅ 註冊為 Global 指令（所有伺服器可用）
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );

    console.log('✅ Slash 指令註冊成功！');
  } catch (error) {
    console.error('❌ 註冊失敗：', error);
  }
})();
