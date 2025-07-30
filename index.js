require('dotenv').config();
const { Client, GatewayIntentBits, Events, Partials } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers, // 這行是剛剛造成問題的
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
  ],
});

// client.once(Events.ClientReady, () => {
//   console.log(`✅ Bot 登入成功：${client.user.tag}`);
// });

// client.on(Events.MessageCreate, async (message) => {
//   if (message.content === '!setup') {
//     const sent = await message.channel.send(
//       '🎮 點選以下表情來取得遊戲身分組：\n🐉 龍族幻想\n🎵 鳴潮'
//     );
//     await sent.react('🐉');
//     await sent.react('🎵');
//   }
// });

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
  
    if (interaction.commandName === 'rofox_role') {
      const sent = await interaction.channel.send(
        '🎮 點選以下表情來取得遊戲身分組：\n🐉 龍族幻想\n🎵 鳴潮'
      );
      await sent.react('🐉');
      await sent.react('🎵');
  
      await interaction.reply({ content: '✅ 角色訊息已送出！', ephemeral: true });
    }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const member = await reaction.message.guild.members.fetch(user.id);

  if (reaction.emoji.name === '🐉') {
    const role = reaction.message.guild.roles.cache.find((r) => r.name === '龍族幻想');
    if (role) await member.roles.add(role);
  }

  if (reaction.emoji.name === '🎵') {
    const role = reaction.message.guild.roles.cache.find((r) => r.name === '鳴潮');
    if (role) await member.roles.add(role);
  }
});

client.on(Events.MessageReactionRemove, async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const member = await reaction.message.guild.members.fetch(user.id);

  if (reaction.emoji.name === '🐉') {
    const role = reaction.message.guild.roles.cache.find((r) => r.name === '龍族幻想');
    if (role) await member.roles.remove(role);
  }

  if (reaction.emoji.name === '🎵') {
    const role = reaction.message.guild.roles.cache.find((r) => r.name === '鳴潮');
    if (role) await member.roles.remove(role);
  }
});


client.login(process.env.DISCORD_TOKEN);

// 在 index.js 最底下加上這段 "保命" 用的 server
const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Bot is running.');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌐 Express server listening on port ${PORT}`);
});
