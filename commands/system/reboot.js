const Command = require('../../base/Command.js');

class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: 'reboot',
      description: 'Restarts the bot.',
      category: 'System',
      usage: 'reboot',
      extended: 'Using this command with PM2 or Forever will cause the bot to exit cleanly, then the process manager will revive it.',
      hidden: true,
      aliases: ['restart'],
      botPerms: [],
      permLevel: 'Bot Admin'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await message.reply('Bot is shutting down.');
      this.client.commands.forEach(async cmd => {
        await this.client.unloadCommand(cmd);
      });
      process.exit();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;