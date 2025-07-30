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

client.once(Events.ClientReady, () => {
  console.log(`✅ Bot 登入成功：${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.content === '!setup') {
    const sent = await message.channel.send(
      '🎮 點選以下表情來取得遊戲身分組：\n🐉 龍族\n🎵 鳴潮'
    );
    await sent.react('🐉');
    await sent.react('🎵');
  }
});

client.on(Events.MessageReactionAdd, async (reaction, user) => {
  if (user.bot) return;

  if (reaction.partial) await reaction.fetch();
  if (reaction.message.partial) await reaction.message.fetch();

  const member = await reaction.message.guild.members.fetch(user.id);

  if (reaction.emoji.name === '🐉') {
    const role = reaction.message.guild.roles.cache.find((r) => r.name === '龍族');
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
    const role = reaction.message.guild.roles.cache.find((r) => r.name === '龍族');
    if (role) await member.roles.remove(role);
  }

  if (reaction.emoji.name === '🎵') {
    const role = reaction.message.guild.roles.cache.find((r) => r.name === '鳴潮');
    if (role) await member.roles.remove(role);
  }
});

client.login(process.env.DISCORD_TOKEN);
