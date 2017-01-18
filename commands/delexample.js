const sql = require('sqlite');
sql.open('./tagsbot.sqlite');
const config = require('../config.json');
exports.run = async(client, message, args) => {
  let name = args.join(' ');
  try {
    const row = await sql.get('SELECT * FROM examples WHERE name = ?', name);
    if (!row) return message.channel.sendMessage(`An example with the name **${name}** could not be found.`);
    await client.channels.get(config.examplesChannel).fetchMessage(row.msgId).then(msg => msg.delete());
    await sql.run('DELETE FROM examples WHERE name = ?', name);
    return message.channel.sendMessage(`The **${name}** example has been deleted`);
  } catch (error) {
    console.error;
  }
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
