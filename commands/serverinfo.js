const Discord = require('discord.js');
exports.run = (client, message, args, level) => {// eslint-disable-line no-unused-vars
  const embed = new Discord.RichEmbed()
    .setAuthor(message.guild.name, message.guild.iconURL)
    .setColor(3447003)
    .setDescription(`Owner: ${message.guild.owner.user.tag} (${message.guild.owner.id})`)
    .addField('Member Count', `${message.guild.memberCount - message.guild.members.filter(m=>m.user.bot).size} (${message.guild.members.filter(m=>m.user.bot).size} bots)`, true)
    .addField('Location', message.guild.region, true)
    .addField('Created', message.guild.createdAt.toLocaleString(), true)
    .addField('Roles', message.guild.roles.size, true)
    .addBlankField(true)
    .setTimestamp()
    .setFooter(client.user.username, client.user.avatarURL);
  message.channel.send({embed}).catch(e => console.error(e));
};

exports.conf = {
  hidden: false,
  guildOnly: true,
  aliases: ['serverstats','guildinfo','guildstats'],
  permLevel: 0
};

exports.help = {
  name: 'serverinfo',
  description: 'Displays server information & statistics.',
  usage: 'serverinfo',
  category: 'General',
  extended: 'This command will return an organised embed with server information and statistics.'
};
