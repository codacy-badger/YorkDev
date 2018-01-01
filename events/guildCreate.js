module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async execute(guild) {
    if (!guild.available) return;
    await this.client.user.setGame(`@${this.client.user.username} help`);
  }
};