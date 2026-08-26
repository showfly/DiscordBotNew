const { PermissionFlagsBits } = require('discord.js');
const colorRoleMap = require('../data/colorRoles');

async function syncColorRoles(guild) {
  const result = {
    existing: 0,
    created: 0,
    failed: 0,
    errors: [],
  };

  const me = guild.members.me;
  if (!me || !me.permissions.has(PermissionFlagsBits.ManageRoles)) {
    const message = `Bot 在「${guild.name}」缺少管理身分組 (Manage Roles) 權限。`;
    result.failed = Object.keys(colorRoleMap).length;
    result.errors.push(message);
    console.warn(`⚠️ ${message}`);
    return result;
  }

  await guild.roles.fetch();

  for (const { name, label, hex } of Object.values(colorRoleMap)) {
    const existingRole = guild.roles.cache.find(role => role.name === name);
    if (existingRole) {
      result.existing += 1;
      continue;
    }

    try {
      await guild.roles.create({
        name,
        color: hex,
        reason: `自動建立名字顏色身分組：${label}`,
      });
      result.created += 1;
      console.log(`🎨 [${guild.name}] 已建立 ${name}`);
    } catch (error) {
      result.failed += 1;
      result.errors.push(`${name}: ${error.message}`);
      console.error(`❌ [${guild.name}] 建立 ${name} 失敗：`, error);
    }
  }

  return result;
}

module.exports = syncColorRoles;
