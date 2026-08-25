const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const commandsDir = path.join(__dirname, '..', 'commands');
const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

test('all command modules expose data and execute', async t => {
  assert.ok(commandFiles.length > 0, 'expected at least one command module');

  for (const file of commandFiles) {
    await t.test(file, () => {
      const command = require(path.join(commandsDir, file));

      assert.ok(command.data, `${file} must export data`);
      assert.equal(typeof command.execute, 'function', `${file} must export execute()`);

      const json = command.data.toJSON();
      assert.ok(json.name, `${file} command name must be defined`);
      assert.ok(json.description, `${file} command description must be defined`);
    });
  }
});
