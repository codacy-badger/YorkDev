module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: ['points', 'level'],
      permLevel: 0
    };

    this.help = {
      name: 'score',
      description: 'Displays your current activity level and points.',
      usage: 'score',
      category: 'Fun',
      extended: ''
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const score = this.client.points.get(message.author.id);
    !score ? message.channel.send('You have no points, or levels yet.') : message.channel.send(`You currently have ${score.points}, which makes you level ${score.level}!`);
  }
};
