const sql = require('sqlite');
exports.run = (client, message, args) => {
  let name = args.join(' ');
  sql.open('./tagsbot.sqlite').then(() => sql.get('SELECT * FROM examples WHERE name = ?', name)).then(row => {
    if (row) {
      let message_content = row.contents;
      return message.channel.sendCode('js', message_content);
    } else {
      return message.channel.sendMessage(`An example by the name **${name}** could not be found.`).then(response => {
        return response.delete(5000);
      });
    }
  }).catch(console.error);
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['examp'],
  permLevel: 0
};

exports.help = {
  name: 'example',
  description: 'Displays an example.',
  usage: 'example <name>'
};
