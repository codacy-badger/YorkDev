const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const defaultSettings = {
  'prefix': '-',
  'modLogChannel': 'mod-log',
  'announceChannel': 'announcements',
  'patronRole': 'Patrons',
  'modRole': 'Moderator',
  'adminRole': 'Administrator',
  'levelNotice': 'false',
  'systemNotice': 'true',
  'inviteLimit': '10',
  'nmsEnabled': 'false',
  'nmsRate': '7500',
  'nmsBanCount': '10',
  'scoreTime': '5',
  'dailyTime': '24',
  'pointsReward': '250',
  'minPoints': '1',
  'maxPoints': '50',
  'costMulti': '10',
  'customEmoji': 'false',
  'gEmojiID': 'replace-this',
  'uEmoji': '💲'
};
const settings = new Enmap({provider: new EnmapLevel({name: 'settings'})});

(async function() {
  await settings.defer;
  if (!settings.has('default')) {
    console.log('First Start! Inserting default guild settings in the database...');
    await settings.setAsync('default', defaultSettings);
  }
}());