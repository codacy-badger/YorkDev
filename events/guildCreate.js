module.exports = async (client, guild) => {
  client.settings.set(guild.id, client.config.defaultSettings);
  client.blacklist.set(guild.id, []);
  await guild.client.user.setGame(`${client.config.defaultSettings.prefix}help | ${guild.client.guilds.size} Servers`);
};
