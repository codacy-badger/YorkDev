function levelText(level) {
  switch (level) {
    case 2: return 'Guild Moderator';
    case 3: return 'Guild Administrator';
    case 4: return 'Guild Owner';
    case 10: return 'Bot Owner';
    default: return 'Guild Member';
  }
}
exports.run = async (client, message, args, level) => {
  message.reply(`Your permission level is: **${level}** | ${levelText(level)}`);
};

exports.conf = {
  hidden: false,
  aliases: ['perms', 'privilege'],
  permLevel: 0
};

exports.help = {
  name: 'mylevel',
  category: 'General',
  description: 'Tells you your permission level for the current guild.',
  usage: 'mylevel'
};
