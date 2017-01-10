const sql = require('sqlite');
exports.run = (client, message) => {
  sql.open('./tagsbot.sqlite').then(() => sql.all('SELECT * FROM tags')).then(rows => {
    return message.channel.sendMessage(rows < 1 ? 'There appears to be no tags saved at this time.' : '**❯ Tags: **' + rows.map(r => r.name).join(', '));
  }).catch(console.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['taglist'],
  permLevel: 0
};

exports.help = {
  name: 'tags',
  description: 'Displays all tags.',
  usage: 'tags'
};
