const request = require('snekfetch');
module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: 0
    };

    this.help = {
      name: 'fox',
      description: 'Grabs your Patreon styled Fox avatar.',
      usage: 'fox',
      category: 'Fun',
      extended: 'This uses the Patreon fox avatar generator, based on your user ID.'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const foxify = message.mentions.users.first() || message.author;
    const image = await request.get(`https://fox.a3c-bot.tk/400/${foxify.id}`).then(d => d.body);
    return message.channel.send({ files: [{ attachment: image, name: `${foxify.username}-fox.png` }] });
  }
};
