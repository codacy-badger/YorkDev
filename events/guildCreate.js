module.exports = async (client, guild) => {
  client.settings.set(guild.id, client.config.defaultSettings);
  await guild.client.user.setGame(`${client.config.prefix}help | ${guild.client.guilds.size} Servers`);
};
