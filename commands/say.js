const Social = require('../base/Social.js');

class Say extends Social {
  constructor(client) {
    super(client, {
      name: 'say',
      description: 'Make the bot say something.',
      usage: 'say [#channel] <message>',
      category: 'Fun',
      extended: 'You can send a message to another channel via this command.',
      cost: 5,
      aliases: ['speak'],
      botPerms: ['SEND_MESSAGES', 'MANAGE_MESSAGES'],
      permLevel: 'Patrons'
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      message.delete();
      const cost = this.cmdDis(this.help.cost, level);
      const payMe = await this.cmdPay(message, message.author.id, cost, this.conf.botPerms);
      if (!payMe) return;  

      const channelid = await this.verifyChannel(message, args[0]);
      if (channelid !== message.channel.id) {
        args.shift();
      }
      const channel = message.guild.channels.get(channelid);
      channel.startTyping();
      setTimeout(() => {
        channel.send(args.join(' '));
        channel.stopTyping(true);
      }, 100 * args.join(' ').length / 2);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Say;