exports.run = async (client, message, args, level) => { // eslint-disable-line no-unused-vars
  const members = message.guild.members.filter(member => member.user.presence.game && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.game.name));
  return message.channel.send(members.map(member => `$kick ${member.id} Discord invite link in \\\`Playing:\\\` field. (${member.user.presence.game.name})`).join('\n') || 'No invite links found.');
};
exports.conf = {
  hidden: true,
  guildOnly: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'checkads',
  description: 'Returns a list of users with adverts',
  usage: 'checkads',
  category:'Moderation',
  extended: 'This command will check for any discord invite links in members \'Playing\' status.'
};
