const snek = require('snekfetch');
module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: ['kitten'],
      permLevel: 0
    };

    this.help = {
      name: 'cat',
      description: 'Grabs a random cat image.',
      usage: 'cat',
      category: 'Fun',
      extended: 'This command grabs a random cat from "http://random.cat/meow".'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const msg = await message.channel.send('`Fetching random cat...`');
      const {body} = await snek.get('http://random.cat/meow');
      await message.channel.send({files: [{attachment: body.file, name: `cat.${body.file.split('.')[2]}`}]});
      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
};
