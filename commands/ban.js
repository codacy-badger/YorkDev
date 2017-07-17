const Discord = require('discord.js');
exports.run = async (client, message, args) => {
  const reason = args.splice(1, args.length).join(' ');
  const guild = message.guild;
  const person = message.mentions.users.first();
  const modlog = message.guild.channels.find('name', 'mod-log');

  try {
    if (!modlog) return message.reply('I cannot find a mod-log channel');
    if (reason.length < 1) return message.reply('You must supply a reason for the ban.');
    if (!guild.me.permissions.has('BAN_MEMBERS')) return message.reply('I do not have the correct permissions');
    if (!person) return message.reply('You must mention someone to ban them.');
    if (!message.guild.member(person).bannable) return message.reply('This member is not bannable.');

    const caseNumber = await modlog.fetchMessages({ limit: 5 }).then((messages) => {
      const thisCase = /Case\s(\d+)/.exec(messages.first().embeds[0].footer.text);
      return thisCase ? parseInt(thisCase[1]) + 1 : 0;
    });

    const embed = new Discord.RichEmbed()
      .setColor(0x00AE86)
      .setTimestamp()
      .setDescription(`**Action:** Ban\n**Target:** ${person.tag}\n**Moderator:** ${message.author.tag}\n**Reason:** ${reason}`)
      .setFooter(`Case ${caseNumber}`);

    await person.send(`${person.username}, you have been banned from **${guild.name}** because _${reason}_`);
    // await guild.ban(person, {days:2, reason});
    await modlog.send({embed});
    await message.reply(`Successfully banned: ${person.username}`);
  } catch (error) {
    console.log(error);
  }
};

exports.conf = {
  hidden: false,
  aliases: ['B&', 'b&', 'banne'],
  permLevel: 2
};

exports.help = {
  name: 'ban',
  description: 'Bans the mentioned user.',
  usage: 'ban [mention] [reason]',
  category:'Moderation'
};
