const request = require('snekfetch');
const HTMLParser = require('fast-html-parser');
const {RichEmbed} = require('discord.js');

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const msg = await message.channel.send('`Fetching random story...`');
  const res = await request.get('http://www.fmylife.com/random');
  const root = HTMLParser.parse(res.text);
  const article = root.querySelector('.block a');
  const downdoot = root.querySelector('.vote-down');
  const updoot = root.querySelector('.vote-up');
  const embed = new RichEmbed()
    .setTitle(`Requested by: ${message.author.username}`)
    .setAuthor('Fuck My Life, Random Edition!')
    .setColor(0x32AAE1)
    .setTimestamp()
    .setDescription(`_${article.childNodes[0].text}\n\n_`)
    .addField('I agree, your life sucks', updoot.childNodes[0].text, true)
    .addField('You deserved it:', downdoot.childNodes[0].text, true);
  if (article.childNodes[0].text.length < 5 ) {
    await msg.delete();
    return message.channel.send('Today, something went wrong, so you\'ll have to try again in a few moments. FML');
  }
  await msg.delete();
  return message.channel.send({embed});
};

exports.conf = {
  hidden: false,
  guildOnly: true,
  aliases: ['fuckmylife', 'fuckme'],
  permLevel: 0
};

exports.help = {
  name: 'fml',
  description: 'Grabs a random "fuck my life" story.',
  usage: 'fml',
  category: 'Fun',
  extended: 'This command grabs a random "fuck my life" story from fmylife.com and displays it in an organised embed.'
};
