const Social = require('../../base/Social.js'),
  ms = require('ms');
class Daily extends Social {
  constructor(client) {
    super(client, {
      name: 'daily',
      description: 'Claim or give your daily points.',
      usage: 'daily [user]',
      category: 'Social',
      extended: 'You can either claim or donate your daily points.',
      cost: 0,
      aliases: ['claim'],
      botPerms: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const payee = args.join(' ') || message.author.id;
    try {
      await this.usrDay(message, message.author.id, payee);
      if (args.join(' ').indexOf('-r') !== -1) {
        const time = '1 day',
          action = 'claim daily';
        this.client.reminders.set(`${message.author.id}-${message.createdTimestamp + ms(time)}`, {
          id: message.author.id,
          reminder: action,
          reminderTimestamp: message.createdTimestamp + ms(time)
        });
        message.channel.send(`I will remind you to \`${action}\`, ${time} from now.`);
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Daily;