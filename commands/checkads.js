exports.run = async (client, message) => {
  const members = message.guild.members.filter(member => member.user.presence.game && /(discord\.(gg|io|me|li)\/.+|discordapp\.com\/invite\/.+)/i.test(member.user.presence.game.name));
  return message.channel.send(members.map(member => `The member ${member.user.tag} (${member.id}) has the following invite in their \`Playing: \` field\n${member.user.presence.game.name}`).join('\n') || 'No invite links found.');
};
exports.conf = {
  hidden: true,
  aliases: [],
  permLevel: 2
};

exports.help = {
  name: 'checkads',
  description: 'Returns a list of users with adverts',
  usage: 'checkads',
  category:'Moderation'
};
