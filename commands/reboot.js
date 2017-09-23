const Command = require('../base/Command.js');

class Reboot extends Command {
  constructor(client) {
    super(client, {
      name: 'reboot',
      description: 'Shuts down the bot.',
      category: 'System',
      usage: 'reboot',
      permLevel: 'Moderator'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      await message.reply('Bot is shutting down.');
      process.exit();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Reboot;