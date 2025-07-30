require('dotenv').config();
const express = require('express');
const {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  REST,
  Routes,
  SlashCommandBuilder,
} = require('discord.js');

// 建立 Discord client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

// === Slash 指令定義 ===
const commands = [
  new SlashCommandBuilder()
    .setName('rofox_role')
    .setDescription('顯示角色選擇訊息')
    .toJSON(),
];

// === 啟動主邏輯 ===
(async () => {
  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    console.log('🌀 註冊指令中...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash 指令已註冊');

    // 登入 bot
    await client.login(process.env.DISCORD_TOKEN);
    console.log('✅ Bot login() 已送出');
  } catch (err) {
    console.error('❌ 錯誤：', err);
    process.exit(1);
  }
})();

// === 當 bot 成功連接 gateway ===
client.once(Events.ClientReady, () => {
  console.log(`🤖 Bot 登入成功：${client.user.tag}`);
});

// === 指令互動事件 ===
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;
  console.log(`📩 收到指令: /${interaction.commandName}`);

  if (interaction.commandName === 'rofox_role') {
    await interaction.deferReply({ ephemeral: true });

    const sent = await interaction.channel.send(
      '🎮 點選以下表情來取得遊戲身分組：\n🐉 龍族幻想\n🎵 鳴潮'
    );
    await sent.react('🐉');
    await sent.react('🎵');

    await interaction.editReply({ content: '✅ 角色訊息已送出！' });
  }
});

// === 表情反應處理 ===
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const member = await reaction.message.guild.members.fetch(user.id);
  const emoji = reaction.emoji.name;
  const roleName = emoji === '🐉' ? '龍族幻想' : emoji === '🎵' ? '鳴潮' : null;
  if (!roleName) return;

  const role = reaction.message.guild.roles.cache.find(r => r.name === roleName);
  if (role) await member.roles.add(role);
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (user.bot) return;
  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const member = await reaction.message.guild.members.fetch(user.id);
  const emoji = reaction.emoji.name;
  const roleName = emoji === '🐉' ? '龍族幻想' : emoji === '🎵' ? '鳴潮' : null;
  if (!roleName) return;

  const role = reaction.message.guild.roles.cache.find(r => r.name === roleName);
  if (role) await member.roles.remove(role);
});

// === Express 保命用 Web server ===
const app = express();
app.get('/', (req, res) => res.send('Bot is running.'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Express listening on port ${PORT}`));
