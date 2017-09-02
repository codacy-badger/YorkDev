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
    const user = args.join(' ') || message.author.id;
    const match = /(?:<@!?)?([0-9]{17,20})>?/gi.exec(user);
    if (!match) return message.channel.send('Not a valid user id.');
    const id = match[1];
    const score = this.client.points.get(id);
    let YouThey, YouThem = '';
    id === message.author ? YouThey = 'You' : 'They';
    id === message.author ? YouThem = 'You' : 'them';
    !score ? message.channel.send(`${YouThey} have no points, or levels yet.`) : message.channel.send(`${YouThey} currently have ${score.points} points, which makes ${YouThem} level ${score.level}!`);
  }
};
