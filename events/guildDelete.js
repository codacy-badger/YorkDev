module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async execute(guild) {
    await this.client.user.setGame(`@${this.client.user.username} help`);
    this.client.settings.delete(guild.id);
  }
};