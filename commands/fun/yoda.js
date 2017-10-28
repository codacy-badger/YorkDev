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
    try {
      const { text } = await snek.get(`http://yoda-api.appspot.com/api/v1/yodish?text=${encodeURIComponent(args.join(' ').toLowerCase())}`);
      message.channel.send(JSON.parse(text).yodish);
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = Yoda;