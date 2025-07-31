require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Client, GatewayIntentBits, Partials, Collection, Events } = require('discord.js');
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

// 讀取 slash 指令
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands');
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// 處理 slash 指令
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
      await command.execute(interaction);
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: '⚠️ 發生錯誤！', ephemeral: true });
    }
  } else if (interaction.isStringSelectMenu()) {
    // 自動載入對應的互動處理
    const handlerPath = `./interactions/${interaction.customId}.js`;
    if (fs.existsSync(handlerPath)) {
      const handler = require(handlerPath);
      await handler(interaction);
    }
  }
});

// 表情事件註冊（加/移除）
client.on(Events.MessageReactionAdd, require('./events/messageReactionAdd'));
client.on(Events.MessageReactionRemove, require('./events/messageReactionRemove'));

// Bot 登入
client.login(process.env.DISCORD_TOKEN);

// Express 保活
require('./server')();
