const config = require('../config.json');
module.exports = async (guild) => {
  await guild.client.user.setGame(`${config.prefix}help | ${guild.client.guilds.size} Servers`);
};
