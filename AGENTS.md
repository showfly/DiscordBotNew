# DiscordBotNew Agent Guidelines

## Project

This repository is a Node.js Discord bot built with discord.js v14.

## Development workflow

After changing JavaScript code, always run the following validation steps:

1. `npm test`
2. `npm run lint`
3. `npm run check`

Do not consider a task complete while any validation step fails.

## Command structure

Slash commands live under `commands/`.

Each command module must export:

- `data`: a `SlashCommandBuilder`
- `execute(interaction)`: an async handler

Follow the existing command style unless the task requires a refactor.

## Testing rules

- Tests must not require a real Discord login.
- Tests must not require `DISCORD_TOKEN`, `CLIENT_ID`, or `GUILD_ID`.
- Prefer unit tests for command metadata and pure logic.
- Do not weaken or delete tests only to make validation pass.

## Security

Never commit or print secrets, including:

- `DISCORD_TOKEN`
- `CLIENT_ID`
- `GUILD_ID`
- webhook URLs
- API keys

Never add `.env` to source control.

## Change discipline

- Prefer minimal, focused changes.
- Do not modify unrelated behavior.
- Preserve compatibility with discord.js v14 unless explicitly asked otherwise.
- If validation fails, inspect the failure, fix the root cause, and run validation again.

## Completion criteria

A change is complete only when:

- tests pass,
- lint passes,
- static syntax checks pass,
- and the final diff contains no secrets or unrelated edits.
