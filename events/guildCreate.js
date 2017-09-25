module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async execute(guild) {
    this.client.settings.set(guild.id, this.client.config.defaultSettings);
    await this.guild.client.user.setGame(`${this.client.config.defaultSettings.prefix}help | ${guild.client.guilds.size} Servers`);
  }
};