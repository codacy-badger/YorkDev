const snek = require('snekfetch');
const Social = require('../base/Social.js');

class Dog extends Social {
  constructor(client) {
    super(client, {
      name: 'dog',
      description: 'Grabs a random dog image.',
      usage: 'dog',
      category: 'Fun',
      extended: 'This command grabs a random dog from "The DogAPI".',
      cost: 20,
      guildOnly: true,
      aliases: ['doggo', 'pupper'],
      botPerms: ['ATTACH_FILES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      if (level < 2) {
        const payMe = await this.pay(message, message.author.id, this.help.cost);
        if (!payMe) return;  
      }
      const msg = await message.channel.send('`Fetching random dog...`');
      const {body} = await snek.get('https://api.thedogapi.co.uk/v2/dog.php?limit=1');
      await message.channel.send({files: [{attachment: body.data[0].url, name: `${body.data[0].id}.jpg`}]});
      await msg.delete();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Dog;