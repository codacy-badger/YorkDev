const sql = require('sqlite');
exports.run = (client, message, args) => {
  let name = args.join(' ');
  sql.open('./tagsbot.sqlite').then(() => sql.get('SELECT * FROM tags WHERE name = ?', name)).then(row => {
    if (row) {
      let message_content = message.mentions.users.array().length === 1 ? `${message.mentions.users.array()[0]} ${row.contents}` : row.contents;
      return message.channel.sendMessage(message_content);
    } else {
      return message.channel.sendMessage(`A tag with the name **${name}** could not be found.`).then(response => {
        return response.delete(5000);
      });
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
