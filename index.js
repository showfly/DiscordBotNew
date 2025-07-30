require('dotenv').config();
const express = require('express');
const {
  Client,
  GatewayIntentBits,
  Partials,
  Events,
  InteractionResponseFlags,
  REST,
  Routes,
  SlashCommandBuilder
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

// === Slash 指令註冊邏輯（啟動時註冊一次） ===
(async () => {
  const commands = [
    new SlashCommandBuilder()
      .setName('rofox_role')
      .setDescription('顯示角色選擇訊息')
      .toJSON(),
  ];

  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log('🌀 註冊指令中...');
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands }
    );
    console.log('✅ Slash 指令已註冊');
  } catch (err) {
    console.error('❌ 指令註冊失敗:', err);
  }
})();

// === Bot 啟動 ===
client.once(Events.ClientReady, () => {
  console.log(`🤖 Bot 登入成功：${client.user.tag}`);
});

// === Slash 指令觸發 ===
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

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

// === 表情新增：加身分組 ===
client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const member = await reaction.message.guild.members.fetch(user.id);

  if (reaction.emoji.name === '🐉') {
    const role = reaction.message.guild.roles.cache.find(r => r.name === '龍族幻想');
    if (role) await member.roles.add(role);
  }

  if (reaction.emoji.name === '🎵') {
    const role = reaction.message.guild.roles.cache.find(r => r.name === '鳴潮');
    if (role) await member.roles.add(role);
  }
});

// === 表情移除：移除身分組 ===
client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const member = await reaction.message.guild.members.fetch(user.id);

  if (reaction.emoji.name === '🐉') {
    const role = reaction.message.guild.roles.cache.find(r => r.name === '龍族幻想');
    if (role) await member.roles.remove(role);
  }

  if (reaction.emoji.name === '🎵') {
    const role = reaction.message.guild.roles.cache.find(r => r.name === '鳴潮');
    if (role) await member.roles.remove(role);
  }
});

// === 啟動 bot ===
client.login(process.env.DISCORD_TOKEN).catch(err => {
  console.error('❌ Bot login 失敗：', err);
});

// === Express 保命用 ping server ===
const app = express();
app.get('/', (req, res) => res.send('Bot is running.'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🌐 Express listening on port ${PORT}`));
