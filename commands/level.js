module.exports = class {
  constructor(client) {
    this.client = client;

    this.conf = {
      hidden: false,
      guildOnly: true,
      aliases: [],
      permLevel: 0
    };

    this.help = {
      name: 'level',
      description: 'Displays your current activity level.',
      usage: 'level',
      category: 'Fun',
      extended: ''
    };
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    const scoreLevel = this.client.points.get(message.author.id).level;
    !scoreLevel ? message.channel.send('You have no levels yet.') : message.channel.send(`You are currently level ${scoreLevel}!`);
  }
};
