async function announcer(client, message, roleName, text) {
  try {
    const role = message.guild.roles.find('name', `${roleName} Subscribers`);
    if (!role) return message.reply(`Cannot find ${roleName} Subscribers`);
    const channel = message.guild.channels.find('name', 'announcements');
    if (!channel) return message.reply('Cannot find Announcements channel');
    if (role.mentionable === false) await role.edit({mentionable: true});
    await channel.send(`${role}\n${text}`);
    await role.edit({mentionable: false});
    await message.delete().catch(console.error);
    return message.channel.send('Successfully posted announcement.');
  } catch (e) {
    client.sendError(e);
  }
}

exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  announcer(client, message, args[0], args.slice(1).join(' '));
};

exports.conf = {
  hidden: false,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'announcement',
  description: 'Posts an announcement.',
  usage: 'announcement <Komada|Idiot> <announcement>',
  category: 'Moderation',
  extended: '[role] is either \'Komada\' or \'Idiot\', followed by your announcement.'
};
