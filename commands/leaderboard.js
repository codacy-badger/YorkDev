const Command = require('../base/Command.js');

class Leaderboard extends Command {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      description: 'Displays the top 10 active users.',
      usage: 'leaderboard',
      category: 'Social',
      aliases: ['top10', 'top', 'leader', 'lb']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    message.reply('Fuck off, not ready yet!');
  }
}

module.exports = Leaderboard;