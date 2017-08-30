module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: ['score'],
      permLevel: 0
    };

    this.help = {
      name: 'points',
      description: 'Displays how many activity points you have.',
      usage: 'points',
      category: 'Fun',
      extended: ''
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const scorePoints = this.client.points.get(message.author.id).points;
    !scorePoints ? message.channel.send('You have no points yet.') : message.channel.send(`You have ${scorePoints} points!`);
  }
};
