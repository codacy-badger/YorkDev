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
  .addField('To Reply', message.author.id === '146048938242211840' ? '?dm Your Message Here' : `?dm ${message.author.id} Your Message Here`);
  try {
    const target = await client.fetchUser(id);
    await target.send({embed});
    await message.channel.send('Sent Successfully');
  } catch (e) {
    if (e.message === 'Cannot send messages to this user') {
      await message.channel.send(`I cannot send that message ${message.author.username}, as it appears they have **Direct Messages's** disabled.`);
    } else {
      console.log(e);
    }
  }
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
