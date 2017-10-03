const Command = require('../base/Command.js');

class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: 'reboot',
      description: 'Restarts the bot.',
      category: 'System',
      usage: 'reboot',
      extended: 'Using this command with PM2 or Forever will cause the bot to exit cleanly, then the process manager will revive it.',
      aliases: ['restart'],
      botPerms: ['SEND_MESSAGES'],
      permLevel: 'Bot Admin'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await message.reply('Bot is shutting down.');
      this.client.commands.forEach(async cmd => {
        if (cmd.shutdown) cmd.shutdown(this.client);
      });
      process.exit();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;