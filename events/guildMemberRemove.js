module.exports = class {
  constructor(client) {
    this.client = client;
  }
  async execute(member) {
    const guild = member.guild;
    this.client.points.delete(`${guild.id}-${member.id}`);
  }
};