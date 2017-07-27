/* global wait */
module.exports = async (client) => {
  await wait(1000);
  client.log('log', `Logged in as ${client.user.username} and I'm ready to serve ${client.users.size} users in ${client.guilds.size} servers.`, 'Ready!');
  await client.user.setGame(`${client.config.defaultSettings.prefix}help | ${client.guilds.size} Servers`);
  client.guilds.filter(g => !client.settings.has(g.id)).forEach(g => client.settings.set(g.id, client.config.defaultSettings));
  // require('../functions/dashboard.js').init(client);
};
