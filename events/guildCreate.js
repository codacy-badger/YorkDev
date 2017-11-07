module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async execute(guild) {
    if (!guild.available) return;
    await this.client.user.setGame(`${this.client.settings.get('default').prefix}help | ${this.client.guilds.size} Servers`);
    this.client.log('log', `New guild has been joined: ${guild.name} (${guild.id}) with ${guild.memberCount - 1 } members.`, 'JOINED');
  }
};