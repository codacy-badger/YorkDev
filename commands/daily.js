const Social = require('../base/Social.js');
class Daily extends Social {
  constructor(client) {
    super(client, {
      name: 'daily',
      description: 'Claim or give your daily 50 G points.',
      usage: 'daily [user]',
      category: 'Social',
      extended: 'You can either claim or donate your daily points.',
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const payee = args.join(' ') || message.author.id;
    this.usrDay(message, message.author.id, payee);
  }
}

module.exports = Daily;
