require('dotenv').config();
const fs = require('fs');
const { Client, GatewayIntentBits, Partials, Collection, Events } = require('discord.js');
const features = require('./config/features');
const syncColorRoles = require('./utils/syncColorRoles');

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
  if (!features.gameRoles && file === 'rofox_role.js') continue;

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
      const errorReply = { content: '⚠️ 發生錯誤！', ephemeral: true };
      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(errorReply).catch(console.error);
      } else {
        await interaction.reply(errorReply).catch(console.error);
      }
    }
  } else if (interaction.isStringSelectMenu()) {
    const handlerPath = `./interactions/${interaction.customId}.js`;
    if (fs.existsSync(handlerPath)) {
      const handler = require(handlerPath);
      await handler(interaction);
    }
  }
});

// 遊戲身分組功能目前暫停；保留程式碼方便日後重新啟用
if (features.gameRoles) {
  client.on(Events.MessageReactionAdd, require('./events/messageReactionAdd'));
  client.on(Events.MessageReactionRemove, require('./events/messageReactionRemove'));
}

// Bot 啟動後，替目前已加入的所有 Server 補齊顏色身分組
client.once(Events.ClientReady, async readyClient => {
  console.log(`✅ ${readyClient.user.tag} 已登入`);

  if (!features.colorRoles) return;

  for (const guild of readyClient.guilds.cache.values()) {
    await syncColorRoles(guild);
  }
});

// Bot 被加入新的 Server 時，自動建立缺少的顏色身分組
client.on(Events.GuildCreate, async guild => {
  if (features.colorRoles) {
    await syncColorRoles(guild);
  }
});

client.login(process.env.DISCORD_TOKEN);

// Express 保活
require('./server')();
