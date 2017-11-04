module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async execute(guild) {
    await this.client.user.setGame(`${this.client.settings.get('default').prefix}help | ${this.client.guilds.size} Servers`);
    this.client.settings.delete(guild.id);
    this.client.log('log', `Guild has been left: ${guild.name} (${guild.id}) with ${guild.memberCount - 1} members.`, 'LEFT');
  }
};