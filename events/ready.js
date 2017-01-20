const config = require('../config.json');
module.exports = async client => {
  console.log('Ready to go!');
  client.user.setGame(`${config.prefix}help`);
};
