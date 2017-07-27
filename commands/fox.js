const request = require('snekfetch');
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const image = await request.get(`https://fox.a3c-bot.tk/400/${message.author.id}`).then(d => d.body);
  return message.channel.send({ files: [{ attachment: image, name: 'fox.png' }] });
};

exports.conf = {
  hidden: false,
  aliases: [],
  permLevel: 0
};

exports.help = {
  name: 'fox',
  description: 'Grabs your Patreon styled Fox avatar.',
  usage: 'fox',
  category: 'Fun'
};
