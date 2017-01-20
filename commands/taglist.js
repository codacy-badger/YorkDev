const sql = require('sqlite');
sql.open('./tagsbot.sqlite');
exports.run = async (client, message) => {
  try {
    const rows = await sql.all('SELECT * FROM tags');
    await message.channel.sendMessage(rows < 1 ? 'There appears to be no tags saved at this time.' : '**❯ Tags: **' + rows.map(r => r.name).join(', '));
  } catch (error) {
    console.error;
  }
};

exports.conf = {
  enabled: true,
  guildOnly: false,
  aliases: ['tags'],
  permLevel: 0
};

exports.help = {
  name: 'taglist',
  description: 'Displays all tags.',
  usage: 'tags'
};
