const Social = require('../base/Social.js');

class Fix extends Social {
  constructor(client) {
    super(client, {
      name: 'fix',
      description: 'Displays your current activity level and G points.',
      usage: 'fix',
      category: 'Social',
      aliases: []
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    await message.channel.send('Fixing now...');
    message.guild.members.forEach(member => {
      const stats = this.client.points.get(`${message.guild.id}-${member.id}`) ||
      this.client.points.set(`${message.guild.id}-${member.id}`, { points: 0, level: 0, user: member.id, guild: message.guild.id, daily: 1504120109 }).get(`${message.guild.id}-${member.id}`);
      stats.level = 0;
      this.client.points.set(`${message.guild.id}-${member.id}`, stats);
    });
    await message.channel.send('All Fixed...');

  }
}

module.exports = Fix;