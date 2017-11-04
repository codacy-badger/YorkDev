const Social = require('../../base/Social.js');

class Leaderboard extends Social {
  constructor(client) {
    super(client, {
      name: 'leaderboard',
      description: 'Displays the top 10 active users.',
      usage: 'leaderboard',
      category: 'Social',
      cost: 0,
      aliases: ['top10', 'top', 'leader', 'lb'],
      botPerms: ['EMBED_LINKS']
    });
  }

  async run(message, args, level) { // eslint-disable-line no-unused-vars
    try {
      const leaderboard = [];
      const posBoard = [];
      const score = this.client.points.get(`${message.guild.id}-${message.author.id}`) || this.client.points.set(`${message.guild.id}-${message.author.id}`, { points: 50, level: 0, user: message.author.id, guild: message.guild.id, daily: 1504120109}).get(`${message.guild.id}-${message.author.id}`);
      const list = this.client.points.filter(p => p.guild === message.guild.id && p.points > 0);
      list.map(p => ({ points: p.points, user: p.user }))
        .sort((a,b) => b.points > a.points ? 1 : -1).forEach(mem => {
        
          posBoard.push(this.client.users.get(mem.user));
        });
      list.map(p => ({ points: p.points, user: p.user }))
        .sort((a, b) => b.points > a.points ? 1 : -1).slice(0, 10)
        .map((u, i) => {
        // console.log(u);
        // console.log(this.client.users.get(u.user));
          leaderboard.push(`${(i + 1).toString().padStart(2, '0')} ❯ ${this.client.users.get(u.user).tag}: ${u.points}`);
        });
      leaderboard.push('-------------------------------------');    
      const pos = (posBoard.indexOf(message.author.id) + 1).toString().padStart(2, '0');
      leaderboard.push(`${pos} ❯ ${message.author.tag}: ${score.points}`);
      await message.channel.send({ embed: { description: leaderboard.join('\n') } });
    } catch (error) {console.log(error);}
  }}

module.exports = Leaderboard;