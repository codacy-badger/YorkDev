exports.run = async (client, message, args) => {
  let reason = args.splice(1, args.length).join(' ');
  let guild = message.guild;
  let person = message.mentions.users.first();
  try {
    if (!reason) return await message.reply('You must supply a reason for the ban.');
    if (!guild.me.permissions.has('BAN_MEMBERS')) return await message.reply('I do not have the correct permissions');
    if (!person) return await message.reply('You must mention someone to ban them.');
    if (!message.guild.member(person).bannable) return await message.reply('This member is not bannable.');
    await person.send(`${person.username}, you have been banned from **${guild.name}** because _${reason}_`);
    await guild.member(person).ban({days:7, reason:reason});
    await message.reply(`Successfully banned: ${person.username}`);
  } catch (error) {
    console.log(error);
  }
};

exports.conf = {
  aliases: ['B&', 'b&', 'banne'],
  permLevel: 2
};

exports.help = {
  name: 'ban',
  description: 'Bans a user from the server.',
  usage: 'ban <mention> <reason>',
  category:'Moderation'
};
