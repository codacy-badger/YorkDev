const Social = require('../base/Social.js');
const snek = require('snekfetch');
class Cat extends Social {
  constructor(client) {
    super(client, {
      name: 'cat',
      description: 'Grabs a random cat image.',
      usage: 'cat',
      category: 'Fun',
      extended: 'This command grabs a random cat from "http://random.cat/meow".',
      cost: 20,
      guildOnly: true,
      aliases: ['kitten'],
      botPerms: ['ATTACH_FILES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (level < 2) {
        const payMe = await this.cmdPay(message, message.author.id, this.help.cost);
        if (!payMe) return;  
      }
      const msg = await message.channel.send('`Fetching random cat...`');
      const {body} = await snek.get('http://random.cat/meow');
      await message.channel.send({files: [{attachment: body.file, name: `cat.${body.file.split('.')[2]}`}]});
      await msg.delete();
    } catch (error) {
      throw error;
    }
  }
}
module.exports = Cat;