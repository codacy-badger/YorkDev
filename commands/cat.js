const snek = require('snekfetch');
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  try {
    const msg = await message.channel.send('`Fetching random cat...`');
    const {body} = await snek.get('http://random.cat/meow');
    await message.channel.send({files: [{attachment: body.file, name: `cat.${body.file.split('.')[2]}`}]});
    await msg.delete();
  } catch (e) {
    console.log(e);
    // if (!e.message.includes('Must be 2000 or fewer in length.')) {
    //   client.sendError(e);
    // }
  }
};

exports.conf = {
  hidden: false,
  guildOnly: true,
  aliases: ['kitten'],
  permLevel: 0
};

exports.help = {
  name: 'cat',
  description: 'Grabs a random cat image.',
  usage: 'cat',
  category: 'Fun',
  extended: 'This command grabs a random cat from "http://random.cat/meow".'
};
