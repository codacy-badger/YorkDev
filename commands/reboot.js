const Command = require('../base/Command.js');

let hasPM2; // eslint-disable-line no-unused-vars

try {
  require.resolve('pm2');
  hasPM2 = 'PM2 is installed, hopefully that means this bot will reboot in a moment!';
} catch (e) {
  hasPM2 = 'Cannot find PM2. You must restart this bot manually from the command prompt.';
}

class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: 'reboot',
      description: 'Shuts down the bot.',
      category: 'System',
      usage: 'reboot',
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await message.reply('Bot is shutting down.');
      process.exit(1);
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;