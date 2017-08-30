function levelText(level) {
  switch (level) {
    case 2: return 'Guild Moderator';
    case 3: return 'Guild Administrator';
    case 4: return 'Guild Owner';
    case 10: return 'Bot Owner';
    default: return 'Guild Member';
  }
}

module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: ['perms', 'privilege'],
      permLevel: 0
    };

    this.help = {
      name: 'mylevel',
      category: 'General',
      description: 'Tells you your permission level for the current guild.',
      usage: 'mylevel',
      extended: 'This will display your permission level, in both numerical and plain English styles.'
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    message.reply(`Your permission level is: **${level}** | ${levelText(level)}`);
  }
};
