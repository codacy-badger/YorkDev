module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async execute(guild) {
    await guild.client.user.setGame(`${this.client.config.defaultSettings.prefix}help | ${guild.client.guilds.size} Servers`);
    this.client.settings.delete(guild.id);
  }
};