module.exports = class {
  constructor(client) {
    this.client = client;
  }
  async execute(member) {
    const guild = member.guild;
    this.client.points.set(`${guild.id}-${member.id}`, { points: 200, level:1, user: member.id, guild: guild.id, daily: 1504120109 });
  }
};