const Social = require('../base/Social.js');

class Pay extends Social {
  constructor(client) {
    super(client, {
      name: 'pay',
      description: 'Pay another user your activity points.',
      usage: 'pay',
      aliases: ['give', 'loan', 'donate']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const user = await this.verifyUser(args[0]);
      if (isNaN(args[1])) return message.channel.send('Not a valid amount');
      await this.pay(message, message.author.id, user, parseInt(args[1]));
      // message.channel.send(points);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Pay;