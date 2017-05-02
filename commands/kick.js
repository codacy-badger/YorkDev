exports.run = async (client, message, args) => {
  let reason = args.splice(1, args.length).join(' ');
  if (!reason) return message.reply('You must supply a reason for the kick.').catch(error => console.error(error));
  let guild = message.guild;
  if (!guild.member(client.user.id).hasPermission('KICK_MEMBERS')) return message.reply('I do not have the correct permissions').catch(error => console.error(error));
  let person = message.mentions.users.first();
  if (!person) return message.reply('You must mention someone to kick them.').catch(error => console.error(error));
  if (!message.guild.member(person).kickable) return message.reply('This member is not kickable.').catch(error => console.error(error));
  try {
    await person.sendMessage(`${person.username}, you have been kicked from **${guild.name}** because _${reason}_`);
    await guild.member(person).ban(7);
    await message.reply(`Successfully kicked: ${person.username}`).then(message => message.delete(3500));
    await message.delete(4000);
  } catch (error) {
    console.error(error);
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'kick',
  description: 'kicks a user from the server.',
  usage: 'kick <mention> <reason>'
};
