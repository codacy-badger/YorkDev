const config = require('../config.json');
module.exports = async client => {
  console.log('Ready to go!');
  await client.user.setGame(`${config.prefix}help | ${client.guilds.size} Servers`);
  // require('../functions/dashboard.js').init(client);
};
