const sql = require('sqlite');
sql.open('./tagsbot.sqlite');
exports.run = async(client, message, args) => {
  let name = args.join(' ');
  if (!name) return message.channel.sendMessage('You must specify a tag to display').catch(console.error);
  try {
    const row = await sql.get('SELECT * FROM tags WHERE name = ?', name);
    if (row) return message.channel.sendMessage(row.contents);
    await message.channel.sendMessage(`A tag with the name **${name}** could not be found.`);
  } catch (error) {
    console.error;
  }
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
