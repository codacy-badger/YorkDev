const Social = require('../base/Social.js');

class Score extends Social {
  constructor(client) {
    super(client, {
      name: 'score',
      description: 'Displays your current activity level and G points.',
      usage: 'score',
      category: 'Social',
      aliases: ['points', 'level', 'bal', 'balance']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const user = args.join(' ') || message.author.id;
    const points = await this.chkBal(message, user);
    return await message.channel.send(points);
  }
}

module.exports = Score;