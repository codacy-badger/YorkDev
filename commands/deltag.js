const sql = require('sqlite');
exports.run = (client, message, args) => {
  let name = args.join(' ');
  sql.open('./tagsbot.sqlite').then(() => {
    return sql.run('DELETE FROM tags WHERE name = ?', name);
  }).then(() => {
    return message.channel.sendMessage(`The tag **${name}** has been deleted`);
  }).then(response => {
    return response.delete(5000);
  }).catch(console.error);

};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['dt'],
  permLevel: 3
};

exports.help = {
  name: 'deltag',
  description: 'Issue this command if you want to remove a tag.',
  usage: 'deltag <name>'
};
