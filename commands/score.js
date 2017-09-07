const Command = require('../base/Command.js');

class Score extends Command {
  constructor(client) {
    super(client, {
      name: 'score',
      description: 'Displays your current activity level and G points.',
      usage: 'score',
      category: 'Fun',
      guildOnly: true,
      aliases: ['points', 'level']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const settings = this.client.settings.get(message.guild.id);
    const pointEmoji = settings.customEmoji ? this.client.emojis.get(settings.gEmojiID) :  settings.uEmoji;

    const user = args.join(' ') || message.author.id;
    const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) return message.channel.send('Not a valid user id.');
    const id = match[1];
    const score = this.client.points.get(`${message.guild.id}-${id}`);
    const YouThey = id === message.author.id ? 'You' : 'They';
    const YouThem = YouThey.length > 3 ? 'them' : 'you';
    message.channel.send(score ? `${YouThey} currently have ${score.points} ${pointEmoji}'s, which makes ${YouThem} level ${score.level}!` : `${YouThey} have no ${pointEmoji}'s, or levels yet.`); 
  }
}

module.exports = Score;