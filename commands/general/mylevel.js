const Command = require(`${process.cwd()}/base/Command.js`);

class MyLevel extends Command {
  constructor(client) {
    super(client, {
      name: 'mylevel',
      category: 'General',
      description: 'Tells you your current level.',
      usage: 'mylevel',
      extended: 'This will display your permission level, in both numerical and plain English styles.',
      guildOnly: true,
      aliases: ['perms', 'privilege'],
      botPerms: []
    });
  }
  async run(message, args, level) {
    const friendly = this.client.config.permLevels.find(l => l.level === level).name;
    message.reply(`Your permission level is: ${level} - ${friendly}`);  }
}

module.exports = MyLevel;