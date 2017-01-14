const sql = require('sqlite');
exports.run = (client, message, args) => {
  let name = args.join(' ');
  if (!name) return message.channel.sendMessage('You must specify a tag to display').catch(console.error);
  sql.open('./tagsbot.sqlite').then(() => sql.get('SELECT * FROM tags WHERE name = ?', name)).then(row => {
    if (row) {
      let message_content = message.mentions.users.array().length === 1 ? `${message.mentions.users.array()[0]} ${row.contents}` : row.contents;
      return message.channel.sendMessage(message_content).catch(console.error);
    } else {
      return message.channel.sendMessage(`A tag with the name **${name}** could not be found.`).catch(console.error);
    }
  }).catch(console.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['t'],
  permLevel: 0
};

exports.help = {
  name: 'tag',
  description: 'Display a tag saved in the database.',
  usage: 'tag <name>'
};
