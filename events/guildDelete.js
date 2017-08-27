module.exports = async (client, guild) => {
  await guild.client.user.setGame(`${client.config.defaultSettings.prefix}help | ${guild.client.guilds.size} Servers`);
  client.settings.delete(guild.id);
  client.blacklist.delete(guild.id);
};
