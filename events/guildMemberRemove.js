const moment = require('moment');
module.exports = async (member) => {
  let guild = member.guild;
  let memberLog = guild.channels.find('name', 'member-log');
  if (!memberLog) return console.log('Can\'t find it');
  memberLog.sendMessage('', {
    embed: {
      color: 0xFF6600,
      author: {
        name: `${member.user.username}#${member.user.discriminator} (${member.user.id})`,
        icon_url: member.user.avatarURL,
      },
      fields: [{
        name: '\u200b',
        value: `User Created | ${moment(member.user.createdTimestamp).format('ddd MMM Do, YYYY [at] h:mm a')}\nUser Left | ${moment().format('ddd MMM Do, YYYY [at] h:mm a')}`
      }]
    }
  });
};
