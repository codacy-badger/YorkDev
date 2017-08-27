const {RichEmbed} = require('discord.js');
exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  if (message.guild) return message.reply('This command can only be used in DM\'s');
  const user = args.join(' ');
  const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
  const id = match ? match[1] : '146048938242211840';
  if (match) args.shift();
  const msg = args.join(' ');
  const embed = new RichEmbed()
  .setAuthor(message.author.username, message.author.displayAvatarURL)
  .setDescription(msg)
  .addField('To Reply', `?dm ${message.author.id} Your Message Here`);
  const target = await client.fetchUser(id);
  await target.send({embed});
};

exports.conf = {
  hidden: true,
  guildOnly: false,
  aliases: ['dm'],
  permLevel: 0
};

exports.help = {
  name: 'contact',
  description: 'Contact York',
  usage: 'contact <message>',
  category: 'System',
  extended: 'Sends a DM to York'
};
