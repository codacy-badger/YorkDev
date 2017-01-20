const sql = require('sqlite');
sql.open('./tagsbot.sqlite');
exports.run = async(client, message, args) => {
  let name = args.join(' ');
  try {
    const row = await sql.get(`SELECT * FROM tags WHERE name = '${name}'`);
    if (!row) return message.channel.sendMessage(`A tag with the name **${name}** could not be found.`);
    await sql.run('DELETE FROM tags WHERE name = ?', name);
    await message.channel.sendMessage(`The tag **${name}** has been deleted`);
  } catch (error) {
    console.error;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['dt', 'deltag'],
  permLevel: 3
};

exports.help = {
  name: 'tagdel',
  description: 'Issue this command if you want to remove a tag.',
  usage: 'tagdel <name>'
};
