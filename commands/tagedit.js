const sql = require('sqlite');
sql.open('./tagsbot.sqlite');
exports.run = async (client, message, args) => {
  let name = args.join(' ');
  if (!name) return message.channel.sendMessage('You must specify a tag to edit').catch(console.error);
  try {
    const row = await sql.get('SELECT * FROM examples WHERE name = ?', name);
    if (!row) return message.channel.sendMessage(`An example by the name **${name}** could not be found.`);

    return message.channel.sendCode('js', row.contents);

    
  } catch (error) {
    console.error;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['edittag'],
  permLevel: 2
};

exports.help = {
  name: 'tagedit',
  description: 'Starts the process of editing a tag.',
  usage: 'tagedit <name>'
};
