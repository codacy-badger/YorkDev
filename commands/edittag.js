const sql = require('sqlite');
exports.run = (client, message, args) => {
  let name = args.join(' ');
  if (!name) return message.channel.sendMessage('You must specify a tag to edit').catch(console.error);
  sql.open('./tagsbot.sqlite').then(() => sql.get('SELECT * FROM examples WHERE name = ?', name)).then(row => {
    if (!row) return message.channel.sendMessage('Could not find a tag by that name');

    if (row) {
      let message_content = row.contents;
      return message.channel.sendCode('js', message_content).catch(console.error);
    } else {
      return message.channel.sendMessage(`An example by the name **${name}** could not be found.`).catch(console.error);
    }
  }).catch(console.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['examp'],
  permLevel: 2
};

exports.help = {
  name: 'example',
  description: 'Displays an example.',
  usage: 'example <name>'
};
