const sql = require('sqlite');
const config = require('../config.json');
exports.run = (client, message, args) => {
  let name = args.join(' ');
  if (!message.member.roles.exists('name', 'Staff')) return;
  sql.open('./tagsbot.sqlite').then(() => sql.get('SELECT * FROM examples WHERE name = ?', name)).then(row => {
    client.channels.get(config.examplesChannel).fetchMessage(row.msgId).then(msg => msg.delete()).then(() => {
      return sql.run('DELETE FROM examples WHERE name = ?', name);
    }).then(() => {
      return message.channel.sendMessage(`The **${name}** example has been deleted`);
    }).then(response => {
      return response.delete(5000);
    }).catch(console.error);
  });
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['delex'],
  permLevel: 3
};

exports.help = {
  name: 'delexample',
  description: 'Deletes an example from the examples channel.',
  usage: 'delexample <name>'
};
