const Command = require('../../base/Command.js');
const snek = require('snekfetch');
class Yoda extends Command {
  constructor(client) {
    super(client, {
      name: 'yoda',
      description: 'With this, like Yoda you can speak. Yes',
      usage: 'yoda <message>',
      extended: 'This command will turn any supplied text into Yoda speech, results may vary.',
      botPerms: ['SEND_MESSAGES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const yoda = args.join(' ');
    const Yodish = encodeURIComponent(yoda);
    try {
      const { text } = await snek.get('http://yoda-api.appspot.com/api/v1/yodish?text='+ Yodish );
      message.reply(JSON.parse(text).yodish);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Yoda;