module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async execute(guild) {
    await this.client.user.setGame(`${this.client.config.defaultSettings.prefix}help | ${this.client.guilds.size} Servers`);
    this.client.settings.set(guild.id, this.client.config.defaultSettings);
  }
};