const sql = require('sqlite');
exports.run = (client, message) => {
  sql.open('./tagsbot.sqlite').then(() => sql.all('SELECT * FROM examples')).then(rows => {
    return message.channel.sendMessage(rows < 1 ? 'There appears to be no tags saved at this time.' : '**❯ Examples: **' + rows.map(r => r.name).join(', '));
  }).catch(console.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['examples', 'exlist'],
  permLevel: 0
};

exports.help = {
  name: 'examplelist',
  description: 'Displays a list of examples.',
  usage: 'examplelist'
};
