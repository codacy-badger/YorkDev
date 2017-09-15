function levelText(level) {
  switch (level) {
    case 2: return 'Guild Moderator';
    case 3: return 'Guild Administrator';
    case 4: return 'Guild Owner';
    case 10: return 'Bot Owner';
    default: return 'Guild Member';
  }
}

const Command = require('../base/Command.js');

class MyLevel extends Command {
  constructor(client) {
    super(client, {
      name: 'mylevel',
      category: 'General',
      description: 'Tells you your permission level for the current guild.',
      usage: 'mylevel',
      extended: 'This will display your permission level, in both numerical and plain English styles.',
      guildOnly: true,
      aliases: ['perms', 'privilege']
    });
  }
  async run(message, args, level) {
    message.reply(`Your permission level is: **${level}** | ${levelText(level)}`);
  }

}

module.exports = MyLevel;