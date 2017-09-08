const snek = require('snekfetch');
const Command = require('../base/Command.js');

class Dog extends Command {
  constructor(client) {
    super(client, {
      name: 'dog',
      description: 'Grabs a random dog image.',
      usage: 'dog',
      category: 'Fun',
      extended: 'This command grabs a random dog from "The DogAPI".',
      guildOnly: true,
      aliases: ['doggo', 'pupper'],
      botPerms: ['ATTACH_FILES']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const msg = await message.channel.send('`Fetching random dog...`');
      const {body} = await snek.get('https://api.thedogapi.co.uk/v2/dog.php?limit=1');
      await message.channel.send({files: [{attachment: body.data[0].url, name: `${body.data[0].id}.jpg`}]});
      await msg.delete();
    } catch (e) {
      console.log(e);
    }
  }
}

module.exports = Dog;