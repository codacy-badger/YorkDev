const funcPatron = require('../functions/funcPatreon.js');
const config = require('../config.json');
const pat = new funcPatron(config.patronAccess);
const util = require('util');
exports.run = (client, message) => {
  // pat.getCurrentUserCampaigns({
  //   include: 'pledges,rewards,creator,goals'
  // }).then((campaigns) => {
  //   campaigns[0].getPledges().then(console.log);
  // }).catch(() => console.error);
  pat.getCurrentUserCampaigns({
    include: 'pledges, rewards, creator, goals'
  }).then((data) => {
    console.log(util.inspect(data, {
      showHidden: true,
      depth: null
    }));
  }).catch(error => console.error(error));
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['support'],
  permLevel: 0
};

exports.help = {
  name: 'patreon',
  description: 'get patreon info',
  usage: 'patreon'
};
